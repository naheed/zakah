import { useState, useEffect, useCallback } from 'react';

// Default fallback prices (USD per troy ounce)
const DEFAULT_GOLD_PRICE = 2650;
const DEFAULT_SILVER_PRICE = 30;

// Cache key and TTL (24 hours)
const CACHE_KEY = 'metalPrices';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface MetalPricesCache {
    goldPrice: number;
    silverPrice: number;
    timestamp: number;
}

interface MetalPricesResult {
    goldPrice: number;
    silverPrice: number;
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    refetch: () => Promise<void>;
}

/**
 * Hook to fetch live gold and silver prices from Metals.dev API.
 * - Fetches once per session, caches in localStorage for 24 hours
 * - Falls back to default prices if API fails
 * - Free tier: 100 requests/month
 */
export function useMetalPrices(): MetalPricesResult {
    const [goldPrice, setGoldPrice] = useState<number>(DEFAULT_GOLD_PRICE);
    const [silverPrice, setSilverPrice] = useState<number>(DEFAULT_SILVER_PRICE);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchPrices = useCallback(async (forceRefresh = false) => {
        // Check cache first (unless force refresh)
        if (!forceRefresh) {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const parsed: MetalPricesCache = JSON.parse(cached);
                    const age = Date.now() - parsed.timestamp;

                    if (age < CACHE_TTL_MS) {
                        setGoldPrice(parsed.goldPrice);
                        setSilverPrice(parsed.silverPrice);
                        setLastUpdated(new Date(parsed.timestamp));
                        setIsLoading(false);
                        return;
                    }
                }
            } catch {
                // Cache read failed, continue to fetch
            }
        }

        // Fetch from API
        setIsLoading(true);
        setError(null);

        try {
            const apiKey = import.meta.env.VITE_METALS_API_KEY;

            if (!apiKey) {
                // No API key configured, use defaults
                console.warn('[useMetalPrices] No API key configured, using defaults');
                setIsLoading(false);
                return;
            }

            const response = await fetch(
                `https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=USD&unit=toz`
            );

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'success' && data.metals) {
                const gold = data.metals.gold || DEFAULT_GOLD_PRICE;
                const silver = data.metals.silver || DEFAULT_SILVER_PRICE;
                const now = Date.now();

                setGoldPrice(gold);
                setSilverPrice(silver);
                setLastUpdated(new Date(now));

                // Cache the result
                const cache: MetalPricesCache = {
                    goldPrice: gold,
                    silverPrice: silver,
                    timestamp: now,
                };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            } else {
                throw new Error('Invalid API response');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch prices';
            console.error('[useMetalPrices] Error:', message);
            setError(message);
            // Keep using default/cached prices
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrices();
    }, [fetchPrices]);

    return {
        goldPrice,
        silverPrice,
        isLoading,
        error,
        lastUpdated,
        refetch: () => fetchPrices(true),
    };
}

/**
 * Utility to format metal prices for display
 */
export function formatMetalPrice(pricePerOunce: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(pricePerOunce);
}

/**
 * Calculate value of gold/silver by weight
 */
export function calculateMetalValue(
    weightInGrams: number,
    pricePerOunce: number
): number {
    const GRAMS_PER_TROY_OUNCE = 31.1035;
    return (weightInGrams / GRAMS_PER_TROY_OUNCE) * pricePerOunce;
}
