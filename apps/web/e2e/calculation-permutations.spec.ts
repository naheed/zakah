/**
 * Calculation Permutations & Combinations Tests
 * 
 * Verifies that the calculation logic works across a wide range of user states
 * and business rule permutations.
 */

import { test, expect } from '@playwright/test';

// Configuration
const BASE_URL = 'http://localhost:8080';
const CALCULATOR_URL = `${BASE_URL}/calculator`;

import { generateScenarios, PermutationScenario } from './helpers/permutationGenerator';

const SCENARIOS: PermutationScenario[] = generateScenarios();

test.describe('Calculation Permutations', () => {

    // Setup: We need to ensure we are in a clean state or handling auth
    // For these tests, we assume public access or mock auth is not strictly required if calculator is public.

    for (const scenario of SCENARIOS) {
        test(`[${scenario.id}] ${scenario.description}`, async ({ page }) => {
            // 1. Start fresh
            await page.goto(CALCULATOR_URL);

            // Handle Welcome Step if present
            // We verify by checking for "Start Calculating" button or "Asset Types" header.
            // Because animations delay the button, we should wait for a known stable element or just wait for the button.

            // Check if we are on Welcome page (look for "Zakat" heading or "Start Calculating")
            // Use race condition robustly or just wait for one main indicator.
            // If "Start Calculating" is eventually visible, click it.
            // If "Asset Types" is eventually visible, we are already there.

            try {
                // Wait up to 3s for either button or header
                await Promise.race([
                    page.waitForSelector('button:has-text("Start Calculating")', { timeout: 3000 }),
                    // Category Step Title
                    page.waitForSelector('text="What assets do you have?"', { timeout: 3000 })
                ]);
            } catch (e) {
                // Ignore timeout, we will check visibility explicitly next
            }

            // Robust Navigation:
            // 1. Check if "Start Calculating" is in the DOM.
            const startButton = page.getByRole('button', { name: 'Start Calculating' });
            if (await startButton.count() > 0) {
                // It exists. Wait for it to be actionable and click.
                // If it's hidden (e.g. we are already past it? unlikely if count > 0 unless hidden),
                // we try to click.
                try {
                    await startButton.click({ timeout: 2000 });
                } catch (e) {
                    // Click failed or timed out. Maybe it wasn't visible.
                    // Verification that we are on the next page happens below.
                }
            }

            // Handle Category Selection Step if present (It usually follows Welcome)
            // We want to ensure we are in "Standard Mode" not Simple Mode.
            // And ensuring we have the necessary categories enabled.
            // For these perm tests, we likely need Gold, Stocks, Crypto, etc enabled if the scenario demands it.

            // Wait for "What assets do you have?"
            await expect(page.getByText('What assets do you have?')).toBeVisible();

            // Enable all relevant categories based on the scenario assets to ensure steps appear
            if (scenario.assets.gold) {
                // Ensure "Precious Metals" is selected. Check if it's already selected?
                // The chips usually toggle. We can assume defaults are off for "Optional"?
                // Or we can just click it. If it was on, it turns off? That's risky.
                // We can check for the checkmark?
                // Checkmark is: <Check weight="bold" ... /> inside AnimatePresence.
                // It's hard to test visual state of custom buttons without aria-pressed.
                // Strategy: Just click "Precious Metals". If it was on, we toggle it off.
                // BUT, default is usually OFF for optional categories.
                // EXCEPT if we persisted state? We started fresh?

                // Safe bet: "Precious Metals" label click.
                await page.getByText('Precious Metals', { exact: true }).click();
            }
            if (scenario.assets.crypto) {
                await page.getByText('Cryptocurrency', { exact: true }).click();
            }

            // For now, just click Next to get to Liquid Assets.
            // If steps are skipped, we might fail later.
            await page.getByRole('button', { name: 'Next' }).click();

            // 2. Set Madhab (We might need to go to settings first or set it via UI)
            // Strategy: Go to settings page first, set madhab, then go to calculator
            // await page.goto(`${BASE_URL}/settings`);

            // ... (Madhab setting logic logic)

            // Re-evaluating Madhab setting:
            // If we are in the wizard, we can't easily jump to settings and back without losing state unless persistence works well.
            // Persistence seems valid (local storage).

            // Let's try setting Madhab via Settings Page *BEFORE* starting the wizard flow?
            // "1. Start fresh" -> Go to Settings -> Set Madhab -> Go to Calculator.

            // NEW FLOW:
            // A. Go to Settings
            // B. Set Madhab
            // C. Go to Calculator
            // D. Navigate Welcome -> Categories -> Liquid Assets

            await page.goto(`${BASE_URL}/settings`);
            // Click the madhab button
            await page.getByRole('button', { name: new RegExp(scenario.madhab, 'i') }).click();

            await page.goto(CALCULATOR_URL);

            // Do navigation sequence
            if (await page.getByRole('button', { name: 'Start Calculating' }).isVisible()) {
                await page.getByRole('button', { name: 'Start Calculating' }).click();
            }
            await expect(page.getByText('Asset Types')).toBeVisible();

            // Ensure categories are selected. 
            // If we just click Next, we assume some defaults. 
            // Ideally we select "Precious Metals", "Investments", "Crypto" to ensure those steps appear.
            // Let's unconditionally select them to be safe.
            // Locator: Text "Precious Metals" might be inside a label.
            await page.getByText('Precious Metals').click();
            await page.getByText('Stocks & Investments').click();
            await page.getByText('Cryptocurrency').click();
            await page.getByText('Retirement').click(); // usually selected

            await page.getByRole('button', { name: 'Next' }).click();

            // 3. Enter Inputs
            // Step 1: Liquid Assets
            // Locator strategy: text=Cash or check for input
            await expect(page.getByText('What are your liquid assets?', { exact: false })).toBeVisible();
            if (scenario.assets.cash) {
                await page.getByTestId('checking-accounts-input').fill(scenario.assets.cash.toString());
            }

            // Click Next
            await page.getByRole('button', { name: 'Next' }).click();

            // Step 2: Investments (Stocks)
            // await expect(page.getByText('Long Term Investments')).toBeVisible();
            if (scenario.assets.stock) {
                await page.getByTestId('brokerage-accounts-input').fill(scenario.assets.stock.toString());
            }
            await page.getByRole('button', { name: 'Next' }).click();

            // Step 3: Retirement
            // await expect(page.getByText('Retirement')).toBeVisible();
            // ... (fill if needed)
            await page.getByRole('button', { name: 'Next' }).click();

            // Step 4: Gold/Silver
            // await expect(page.getByText('Gold & Silver')).toBeVisible();
            if (scenario.assets.gold) {
                await page.getByTestId('gold-value-input').fill(scenario.assets.gold.toString());
            }
            await page.getByRole('button', { name: 'Next' }).click();

            // Step 5: Loans/Debts
            if (scenario.liabilities.creditCard) {
                // Determine if we are on liabilities step
                await page.getByTestId('credit-card-debt-input').fill(scenario.liabilities.creditCard.toString());
            }
            await page.getByRole('button', { name: 'Calculate' }).click();

            // 4. Verify Results
            // Wait for results to appear
            await expect(page.getByText('Zakat Due')).toBeVisible();

            // Extract value
            // Finding the large number display. 
            // Based on ResultsStep.tsx: <ReportHero zakatDue={...} />
            // It often displays as "$250.00"
            const zakatText = await page.getByText(/\$\d+/).first().innerText();
            const zakatValue = parseFloat(zakatText.replace(/[^0-9.]/g, ''));

            // Allow small margin of error for currency rounding
            expect(zakatValue).toBeCloseTo(scenario.expectedZakat, 1);
        });
    }
});
