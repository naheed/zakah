import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
    test('landing page (light mode) should not have any automatically detectable accessibility issues', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(1000);
        const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
        expect(scan.violations).toEqual([]);
    });

    test('landing page (dark mode) should not have any accessibility issues', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'dark' });
        await page.goto('/');
        await page.waitForTimeout(1000);
        const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
        expect(scan.violations).toEqual([]);
    });

    test('wizard step 1 should be accessible', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: /Start Calculating/i }).click();
        await page.waitForLoadState('networkidle');
        await page.waitForURL('**/calculate');

        const scan = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        expect(scan.violations).toEqual([]);
    });
});
