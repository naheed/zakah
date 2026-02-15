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
    },
    FEEDBACK: {
        REACTION: "feedback_reaction",
        SURVEY_CLICK: "survey_link_click",
    },
} as const;
