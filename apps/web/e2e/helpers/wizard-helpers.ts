/**
 * Shared E2E Test Utilities for Wizard Navigation
 * 
 * These helpers provide consistent, reusable functions for navigating
 * the Zakat calculation wizard across all E2E tests.
 * 
 * Flow: Welcome → Setup (Preferences) → Categories (conditional) → Assets → Results
 */

import { Page, BrowserContext, expect } from '@playwright/test';

// =============================================================================
// State Management
// =============================================================================

/**
 * Clear all app state (cookies, localStorage, sessionStorage, IndexedDB) for a fresh test.
 * Navigates to the app first to avoid SecurityError on localStorage access.
 * Important: Waits for React to fully settle after clearing.
 */
export async function clearAppState(page: Page, context: BrowserContext): Promise<void> {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
        try {
            localStorage.clear();
            sessionStorage.clear();
            // Also clear IndexedDB to remove any persisted state
            indexedDB.deleteDatabase('zakatflow');
        } catch (e) {
            // Ignore - may fail in some contexts
        }
    });
    // Hard reload to force React to reinitialize with empty state
    await page.reload();
    await page.waitForLoadState('networkidle');
    // Extra wait for React to settle and hooks to complete
    await page.waitForTimeout(1500);
}

// =============================================================================
// Wizard Entry Points
// =============================================================================

/**
 * Start the calculation wizard from the landing page.
 * Clicks the "Start Calculating" button and waits for navigation.
 * Uses fallback selectors for robustness.
 */
export async function startWizard(page: Page): Promise<void> {
    // Try testId first, fall back to text-based selector
    let startButton = page.getByTestId('start-calculating-button').first();

    // Check if testId button is visible within 5 seconds
    const isTestIdVisible = await startButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isTestIdVisible) {
        // Fallback to text-based selector
        startButton = page.getByRole('button', { name: /Start Calculating/i }).first();
    }

    await expect(startButton).toBeVisible({ timeout: 15000 });
    // Use JS click to bypass viewport/overlay issues (sticky header covers CTA)
    await startButton.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(1500); // Allow transition animation
}

/**
 * Navigate from Welcome through Setup step with the specified mode.
 * @param mode - 'detailed' (default) or 'simple'
 */
export async function navigateThroughSetup(
    page: Page,
    mode: 'detailed' | 'simple' = 'detailed',
    madhab?: string
): Promise<void> {
    // Verify we're on the Setup step
    await expect(page.getByText('Personalize Your Calculation')).toBeVisible({ timeout: 10000 });

    // Select mode
    if (mode === 'detailed') {
        await page.getByText('Detailed Breakdown').click();
    } else {
        await page.getByText('Quick Estimate').click();
    }

    // Select Methodology if requested (e.g. 'balanced', 'hanafi') by clicking the label mapped to the ID
    if (madhab) {
        // Find the label linked to id={rule.name} where rule.name matches the madhab. 
        // e.g. <Label htmlFor="hanafi">
        await page.locator(`label[for="${madhab}"]`).click({ force: true });
    }

    // Proceed to next step
    await clickNext(page);
}

/**
 * Complete the full wizard entry: Start → Setup → Categories (if detailed).
 * This is the most common entry point for tests that need to reach asset steps.
 */
export async function enterWizardDetailedMode(page: Page): Promise<void> {
    await startWizard(page);
    await navigateThroughSetup(page, 'detailed');
    // Now on Categories step
    await expect(page.getByText('What assets do you have?')).toBeVisible({ timeout: 10000 });
}

/**
 * Complete wizard entry for Simple Mode: Start → Setup (Simple) → Liquid Assets.
 */
export async function enterWizardSimpleMode(page: Page): Promise<void> {
    await startWizard(page);
    await navigateThroughSetup(page, 'simple');
    // Should skip Categories and go directly to simple mode or liquid assets
}

// =============================================================================
// Navigation Helpers
// =============================================================================

/**
 * Click the Next/Continue button to advance to the next step.
 * Handles both "Next" and "Continue" button labels.
 */
export async function clickNext(page: Page): Promise<void> {
    const nextButton = page.getByRole('button', { name: /Next|Continue/i });
    await expect(nextButton).toBeVisible({ timeout: 5000 });
    await nextButton.click();
    await page.waitForTimeout(500); // Allow step transition
}

/**
 * Click the Previous button to return to the previous step.
 * Note: The button is labeled "Previous" in StepNavigation.tsx
 */
export async function clickBack(page: Page): Promise<void> {
    const backButton = page.getByRole('button', { name: /Previous/i });
    await expect(backButton).toBeVisible({ timeout: 5000 });
    await backButton.click();
    await page.waitForTimeout(500);
}

// =============================================================================
// Step Verification Helpers
// =============================================================================

/**
 * Verify we're on the Setup (Preferences) step.
 */
export async function expectSetupStep(page: Page): Promise<void> {
    await expect(page.getByText('Personalize Your Calculation')).toBeVisible({ timeout: 10000 });
}

/**
 * Verify we're on the Categories step.
 */
export async function expectCategoriesStep(page: Page): Promise<void> {
    await expect(page.getByText('What assets do you have?')).toBeVisible({ timeout: 10000 });
}

/**
 * Verify we're on the Liquid Assets step.
 */
export async function expectLiquidAssetsStep(page: Page): Promise<void> {
    await expect(page.getByText('What are your liquid assets?')).toBeVisible({ timeout: 10000 });
}

/**
 * Verify we're on the Results step.
 */
export async function expectResultsStep(page: Page): Promise<void> {
    await expect(page.getByText(/Zakat|Results|Obligation/i).first()).toBeVisible({ timeout: 10000 });
}

// =============================================================================
// Data Entry Helpers
// =============================================================================

/**
 * Fill the checking accounts input field.
 */
export async function fillCheckingAccounts(page: Page, amount: string): Promise<void> {
    const input = page.getByTestId('checking-accounts-input');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(amount);
}

/**
 * Fill the savings accounts input field.
 */
export async function fillSavingsAccounts(page: Page, amount: string): Promise<void> {
    const input = page.getByTestId('savings-accounts-input');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(amount);
}

/**
 * Fill the credit card debt input field.
 */
export async function fillCreditCardDebt(page: Page, amount: string): Promise<void> {
    const input = page.getByTestId('credit-card-debt-input');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(amount);
}

// =============================================================================
// Calculation Flow Helpers
// =============================================================================

/**
 * Complete a minimal calculation flow with just liquid assets.
 * Useful for smoke tests.
 */
export async function completeMinimalCalculation(
    page: Page,
    checkingAmount: string = '10000'
): Promise<number> {
    // Enter wizard in detailed mode
    await enterWizardDetailedMode(page);

    // Skip Categories (use defaults)
    await clickNext(page);

    // Fill Liquid Assets
    await expectLiquidAssetsStep(page);
    await fillCheckingAccounts(page, checkingAmount);
    await clickNext(page);

    // Skip Investments
    await clickNext(page);

    // Skip Retirement
    await clickNext(page);

    // Skip Liabilities
    await clickNext(page);

    // Wait for Results
    await page.waitForTimeout(2000);
    await expectResultsStep(page);

    // Extract Zakat amount
    const zakatLocator = page.locator('text=/\\$[\\d,]+\\.?\\d*/').first();
    await zakatLocator.waitFor({ state: 'visible', timeout: 5000 });
    const zakatText = await zakatLocator.innerText();
    return parseFloat(zakatText.replace(/[$,]/g, ''));
}

// =============================================================================
// Permutation Scenario Runner
// =============================================================================

/**
 * Run a full calculation scenario through the wizard using DETERMINISTIC step flow.
 * 
 * The wizard step order (detailed mode) after Categories is:
 *   1. Liquid Assets    (always)
 *   2. Investments      (always)
 *   3. Retirement       (always)
 *   4. Precious Metals  (only if hasPreciousMetals — i.e. Gold selected in categories)
 *   5. Crypto           (only if hasCrypto — i.e. Crypto selected in categories)
 *   6. Liabilities      (always)
 *   7. Results          (always)
 *
 * Conditional steps get their clickNext INSIDE the if-block.
 * Unconditional steps always get a clickNext.
 */
export async function runCalculationScenario(
    page: Page,
    scenario: {
        madhab: string;
        assets: { cash: number; gold: number; stock: number; crypto: number };
        liabilities: { creditCard: number; mortgage: number };
    }
): Promise<void> {
    // --- Categories Step ---
    await expectCategoriesStep(page);

    // Only select OPTIONAL categories — Cash, Investments, Retirement are always shown
    if (scenario.assets.gold) {
        await page.getByText('Gold & Silver', { exact: true }).click();
        await page.waitForTimeout(300);
    }
    if (scenario.assets.crypto) {
        await page.getByText('Cryptocurrency', { exact: true }).click();
        await page.waitForTimeout(300);
    }
    // Note: Investments is a DEFAULT category (always shown), no need to select it
    await clickNext(page);

    // --- Step 1: Liquid Assets (always shown) ---
    await expectLiquidAssetsStep(page);
    if (scenario.assets.cash) {
        await page.getByTestId('checking-accounts-input').fill(scenario.assets.cash.toString());
    }
    await clickNext(page);

    // --- Step 2: Investments (always shown) ---
    if (scenario.assets.stock) {
        const passiveInput = page.getByTestId('passive-investments-value-input');
        await passiveInput.waitFor({ state: 'visible', timeout: 10000 });
        await passiveInput.scrollIntoViewIfNeeded();
        await passiveInput.fill(scenario.assets.stock.toString());
    }
    await clickNext(page);

    // --- Step 3: Retirement (always shown) ---
    await clickNext(page);

    // --- Step 4: Precious Metals (CONDITIONAL — only if gold selected in categories) ---
    if (scenario.assets.gold) {
        const enterUsdText = page.getByText('Enter USD Value');
        await enterUsdText.waitFor({ state: 'visible', timeout: 10000 });
        await enterUsdText.click();
        await page.waitForTimeout(300);
        const goldInput = page.getByTestId('gold-investment-input');
        await goldInput.waitFor({ state: 'visible', timeout: 5000 });
        await goldInput.scrollIntoViewIfNeeded();
        await goldInput.fill(scenario.assets.gold.toString());
        await clickNext(page);
    }

    // --- Step 5: Crypto (CONDITIONAL — only if crypto selected in categories) ---
    if (scenario.assets.crypto) {
        const cryptoInput = page.getByTestId('crypto-currency-input');
        await cryptoInput.waitFor({ state: 'visible', timeout: 10000 });
        await cryptoInput.scrollIntoViewIfNeeded();
        await cryptoInput.fill(scenario.assets.crypto.toString());
        await clickNext(page);
    }

    // --- Step 6: Liabilities (always shown) ---
    if (scenario.liabilities.creditCard) {
        const debtInput = page.getByTestId('credit-card-debt-input');
        await debtInput.waitFor({ state: 'visible', timeout: 10000 });
        await debtInput.scrollIntoViewIfNeeded();
        await debtInput.fill(scenario.liabilities.creditCard.toString());
    }
    await clickNext(page);

    // --- Step 7: Results ---
    await page.waitForTimeout(1000);
    await expectResultsStep(page);
}
