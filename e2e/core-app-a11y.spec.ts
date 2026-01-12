import { test, expect } from '@playwright/test';
import { checkA11y } from './utils/a11y-helper';

test.describe('Core App Accessibility (Guest Flow)', () => {

    test('Zakat Wizard and Report Flow', async ({ page }) => {
        test.setTimeout(180000); // 3 min for full flow with a11y scans

        // 1. Landing Page -> Start
        await page.goto('/');
        await page.waitForLoadState('networkidle');

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
        await checkA11y(page, 'Wizard - Categories Step');

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
        await checkA11y(page, 'Wizard - Liquid Assets Step');

        // 4. Navigate to and scan Investments
        await navigateSteps('Investments');
        await checkA11y(page, 'Wizard - Investments Step');

        // 5. Navigate to and scan Retirement
        await navigateSteps('Retirement');
        await checkA11y(page, 'Wizard - Retirement Step');

        // 6. Navigate to and scan Deductions (Liabilities)
        await navigateSteps('Deductions');
        await checkA11y(page, 'Wizard - Liabilities Step');

        // 7. Navigate to Results (Your Zakat)
        await navigateSteps('Your Zakat');

        // Verify we're on results page
        await expect(page.getByText('Zakat Calculation Results')).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(1500); // Let charts/animations settle

        // Scan Report Page
        await checkA11y(page, 'Report Page');
    });

});
