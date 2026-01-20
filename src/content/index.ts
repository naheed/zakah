/**
 * ZakatFlow Content System
 *
 * This module centralizes all user-facing text for the application.
 * Benefits:
 * - Single source of truth for UI copy
 * - Type-safe string access (autocomplete, compile-time checks)
 * - Easy tone/voice iteration without touching components
 * - Prepares for future i18n if needed
 *
 * Usage:
 * import { content } from '@/content';
 * <h1>{content.wizard.welcome.headline}</h1>
 */

// Re-export all content modules
export * from './common';
export * from './wizard';
export * from './marketing';
export * from './report';
export * from './assets';
export * from './dashboard';
export * from './settings';
export * from './steps';
export * from './methodology';


// Unified content object for convenience
import * as common from './common';
import * as wizard from './wizard';
import * as marketing from './marketing';
import * as report from './report';
import * as assets from './assets';
import * as dashboard from './dashboard';
import * as settings from './settings';
import * as methodology from './methodology';
import * as zakatGuide from './zakatGuide';
import * as privacy from './privacy';
import * as terms from './terms';

export const content = {
    common,
    wizard,
    marketing,
    report,
    assets,
    dashboard,
    settings,
    methodology,
    zakatGuide,
    privacy,
    terms,
} as const;
