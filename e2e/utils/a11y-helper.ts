import { Page, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Runs accessibility checks on the current page state.
 * @param page Playwright Page object
 * @param contextName Optional name for the context (e.g., "Settings - Dark Mode")
 * @param options Optional configuration including rules to exclude
 */
export async function checkA11y(
    page: Page,
    contextName: string = 'Current Page',
    options: { exclude?: string[] } = {}
) {
    const builder = new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);

    if (options.exclude) {
        builder.exclude(options.exclude);
    }

    const accessibilityScanResults = await builder.analyze();

    if (accessibilityScanResults.violations.length > 0) {
        console.log(`\n❌ Accessibility Violations in [${contextName}]:`);
        console.log(JSON.stringify(accessibilityScanResults.violations, null, 2));
    }

    expect(accessibilityScanResults.violations, `Accessibility violations found in ${contextName}`).toEqual([]);
}
