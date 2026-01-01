
// Format large numbers nicely (e.g., 1.2M, 450K)
export function formatLargeNumber(value: number): string {
    if (value >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(1)}B+`;
    }
    if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M+`;
    }
    if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(0)}K+`;
    }
    return `$${value.toLocaleString()}`;
}

export function formatCount(value: number): string {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M+`;
    }
    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K+`;
    }
    return value.toLocaleString();
}
