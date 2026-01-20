import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

/**
 * Hook to automatically track page views on route changes.
 * Must be used inside a Component rendered within <BrowserRouter>
 */
export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location]);
};
