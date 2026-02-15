/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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

// Re-export all content modules (except those with name conflicts)
export * from './common';
export * from './wizard';
// marketing and report both export 'hero', so access via content.marketing.hero / content.report.hero
export * from './assets';
export * from './dashboard';
export * from './settings';
export * from './steps';
export * from './methodology';
export * from './privacy';
export * from './terms';


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
