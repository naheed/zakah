import { test, expect } from '@playwright/test';
import { checkA11y } from './utils/a11y-helper';

const themes = ['light', 'dark'] as const;

test.describe('Core App Accessibility (Guest Flow)', () => {

    themes.forEach(theme => {
        test(`Zakat Wizard and Report Flow (${theme} mode)`, async ({ page }) => {
            test.setTimeout(180000); // 3 min per theme

            // 1. Landing Page -> Start
            await page.goto('/');

            // Force Theme Preference
            await page.evaluate((t) => {
                localStorage.setItem('theme', t);
            }, theme);
            await page.reload();
            await page.waitForLoadState('networkidle');

            // Verify Theme Applied
            // next-themes adds 'dark' class to html element when dark mode is active
            if (theme === 'dark') {
                await expect(page.locator('html')).toHaveClass(/dark/);
            } else {
                await expect(page.locator('html')).not.toHaveClass(/dark/);
            }

            // Scan Landing Page (CRITICAL for dark mode check)
            await checkA11y(page, `Landing Page - ${theme} mode`);

            // Click Start Calculating
            const startButton = page.getByRole('button', { name: /Start Calculating/i });
            await expect(startButton).toBeVisible();
            await startButton.click();

            // Wait for wizard to load
            await page.waitForTimeout(1000);

            // 2. Categories Step - Switch to Detailed Mode if needed
            const switchBtn = page.getByRole('switch');
            await expect(switchBtn).toBeVisible({ timeout: 5000 });

            // In SimpleModeToggle: checked={!isSimpleMode}
            // So aria-checked='true' = Detailed Mode, aria-checked='false' = Simple Mode
            const ariaChecked = await switchBtn.getAttribute('aria-checked');
            if (ariaChecked === 'false') {
                // Currently Simple Mode, click to switch to Detailed
                await switchBtn.click();
                await page.waitForTimeout(500);
            }

            // Verify we're in Detailed Mode by checking for category selection content
            await expect(page.getByText('What assets do you have?')).toBeVisible({ timeout: 5000 });
            await page.waitForTimeout(1000); // Let animations settle

            // Scan Categories Step
            await checkA11y(page, `Wizard - Categories Step - ${theme} mode`);

            // Use Step Navigator Drawer for reliable navigation
            // This bypasses any issues with the Continue button
            const navigateSteps = async (stepName: string) => {
                const menuBtn = page.getByRole('button', { name: /Navigate steps/i });
                await expect(menuBtn).toBeVisible({ timeout: 5000 });
                await menuBtn.click();

                // Wait for drawer to open
                await page.waitForTimeout(300);

                // Find and click the step
                const stepBtn = page.locator(`[role="dialog"] button`).filter({ hasText: new RegExp(stepName, 'i') });
                await expect(stepBtn).toBeVisible({ timeout: 5000 });
                await stepBtn.click();

                // Wait for step transition
                await page.waitForTimeout(1000);
            };

            // 3. Navigate to and scan Liquid Assets (Cash & Bank)
            await navigateSteps('Cash & Bank');
            await checkA11y(page, `Wizard - Liquid Assets Step - ${theme} mode`);

            // 4. Navigate to and scan Investments
            await navigateSteps('Investments');
            await checkA11y(page, `Wizard - Investments Step - ${theme} mode`);

            // 5. Navigate to and scan Retirement
            await navigateSteps('Retirement');
            await checkA11y(page, `Wizard - Retirement Step - ${theme} mode`);

            // 6. Navigate to and scan Deductions (Liabilities)
            await navigateSteps('Deductions');
            await checkA11y(page, `Wizard - Liabilities Step - ${theme} mode`);

            // 7. Navigate to Results (Your Zakat)
            await navigateSteps('Your Zakat');

            // Verify we're on results page
            await expect(page.getByText('Zakat Calculation Results')).toBeVisible({ timeout: 10000 });
            await page.waitForTimeout(1500); // Let charts/animations settle

            // Scan Report Page
            await checkA11y(page, `Report Page - ${theme} mode`);
        });
    });

});
