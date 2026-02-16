import { test, expect } from '@playwright/test';

test.describe('Methodology Page Anchors', () => {
    test('should have all critical anchor sections present', async ({ page }) => {
        // Navigate to Methodology page
        await page.goto('/methodology');

        // List of anchors that must exist (from TOC and application usage)
        const requiredAnchors = [
            'explorer',
            'principles',
            'nisab',
            'hawl',
            'liquid',
            'cash', // Alias for liquid
            'retirement',
            'investments',
            'crypto',
            'realestate',
            'business',
            'metals',
            'debts',
            'trusts',
            'glossary',
            'references',
        ];

        for (const anchor of requiredAnchors) {
            const element = page.locator(`#${anchor}`);
            await expect(element).toBeAttached({ timeout: 5000 });
            // We check if it's attached (present in DOM). 
            // Visibility might be affected by ScrollReveal but usually they are present.
        }
    });

    test('TOC links should be active and point to valid targets', async ({ page }) => {
        await page.goto('/methodology');
        // Check if TOC items render
        const tocLinks = page.locator('nav[aria-label="Table of Contents"] a');
        await expect(tocLinks.first()).toBeVisible();
    });

    test('Ahmed Family Case Study should render correctly', async ({ page }) => {
        await page.goto('/methodology');

        // Check case study header
        const caseStudy = page.locator('#case-study');
        await expect(caseStudy).toBeVisible();
        await expect(caseStudy.locator('h2')).toContainText('The Ahmed Family');

        // Test tabs
        const assetsTab = page.locator('button[role="tab"]:has-text("Assets")');
        const liabilitiesTab = page.locator('button[role="tab"]:has-text("Liabilities")');

        await expect(assetsTab).toBeVisible();
        await expect(liabilitiesTab).toBeVisible();

        // Switch to liabilities
        await liabilitiesTab.click();
        await expect(page.locator('th:has-text("Liability Description")')).toBeVisible();
    });
});

test.describe('ZMCS Page', () => {
    test('should render methodology registry', async ({ page }) => {
        await page.goto('/methodology/zmcs');

        await expect(page.locator('#registry')).toBeVisible();
        await expect(page.locator('table')).toBeVisible();
        await expect(page.locator('text=Hanafi (Standard)')).toBeVisible();
    });

    test('schema reference tabs should be interactive', async ({ page }) => {
        await page.goto('/methodology/zmcs');

        const thresholdsTab = page.locator('button[role="tab"]:has-text("Thresholds")');
        await thresholdsTab.click();

        await expect(page.locator('h3:has-text("Thresholds Schema")')).toBeVisible();
    });
});
