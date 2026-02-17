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

import ReactGA from "react-ga4";

// Environment check
const IS_PROD = import.meta.env.PROD;
const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

/**
 * Initialize Google Analytics
 * Should be called once in App.tsx
 */
export const initAnalytics = () => {
    if (IS_PROD && GA_ID) {
        ReactGA.initialize(GA_ID);
        console.log("[Analytics] Initialized GA4");
    } else {
        console.log("[Analytics] Local/Dev mode: Tracking disabled (Logs only)");
    }
};

/**
 * Track a page view
 * Automatically handled by usePageTracking hook, but exposed if needed.
 */
export const trackPageView = (path: string) => {
    if (IS_PROD && GA_ID) {
        ReactGA.send({ hitType: "pageview", page: path });
    } else {
        console.log(`[Analytics] Page View: ${path}`);
    }
};

/**
 * Track a custom event
 * @param category - The feature component (e.g., "Wizard", "Report")
 * @param action - The action performed (e.g., "Step Completed", "Feedback Given")
 * @param label - Optional details
 * @param value - Optional numeric value
 */
export const trackEvent = (
    category: string,
    action: string,
    label?: string,
    value?: number
) => {
    if (IS_PROD && GA_ID) {
        ReactGA.event({
            category,
            action,
            label,
            value,
        });
    } else {
        console.log(
            `[Analytics] Event: [${category}] ${action} ${label ? `(${label})` : ""} ${value ? `Value: ${value}` : ""
            }`
        );
    }
};

/**
 * Set User Properties (Segmentation)
 * @param properties - Key/value pairs of user attributes
 */
export const setUserProperties = (properties: Record<string, string | number | boolean>) => {
    if (IS_PROD && GA_ID) {
        // react-ga4 exposes .set() but types may lag behind — cast is safe
        (ReactGA as unknown as { set: (props: Record<string, unknown>) => void }).set(properties);
    } else {
        console.log(`[Analytics] Set User Properties:`, properties);
    }
};

export const AnalyticsEvents = {
    WIZARD: {
        STEP_VIEW: "view_step",
        COMPLETE: "calculation_complete",
        ERROR: "calculation_error",
        DEEP_LINK: "deep_link_landed",
        JUMP_TO_STEP: "jump_to_step",
    },
    FEEDBACK: {
        REACTION: "feedback_reaction",
        SURVEY_CLICK: "survey_link_click",
    },
    SHARE: {
        METHODOLOGY_LINK: "share_methodology_link",
        CONFIG_JSON: "share_config_json"
    }
} as const;
