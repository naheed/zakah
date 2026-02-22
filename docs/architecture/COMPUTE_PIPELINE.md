# Architecture: Compute-All Pipeline

## Conceptual Overview
The ZakatFlow calculation architecture was recently migrated to a **"Compute-All, Filter at Presentation"** pipeline.

Previously, `calculateZakat` generated a single `ZakatCalculationResult` based *only* on the user's currently selected `Madhab` (methodology). This was fragile; if the UI state was corrupted or if a selector component accidentally overwrote the `madhab` variable, the engine would silently calculate the wrong methodology.

## The Compute-All Pipeline (`calculateAllMethodologies`)

Located in `@zakatflow/core/zakatCalculations.ts`, the new `calculateAllMethodologies()` wrapper addresses this fragility:

```typescript
export interface AllMethodologyResults {
  /** Results keyed by methodology identifier (e.g., 'bradford', 'tahir_anwar') */
  results: Record<string, ZakatCalculationResult>;
  /** The methodology IDs that were computed, in registry order */
  methodologies: string[];
  /** Wall-clock compute time in milliseconds, useful for benchmarking */
  computeTimeMs: number;
}
```

### 1. Single-Pass Execution
Instead of passing `madhab` into the engine, the engine independently runs `calculateZakat()` against **all 8 registered presets** in a single pass (`O(N)` where N is the number of presets). Because the calculation logic uses fast `if/else` evaluations over POJOs, computing all presets takes `<1ms` total.

### 2. Resilience
The engine's `results` record separates intent from calculation. Even if the UI `SetupStep` selection is lost or temporarily overwritten downstream, the engine still produces correct mathematical matrices for every methodology.

### 3. Presentation Layer Consumption
The presentation layer (React) uses the user's selected `madhab` *only* to pluck the correct result from the `Record<string, ZakatCalculationResult>`.

```typescript
const { results } = calculateAllMethodologies(formData, silverPrice, goldPrice);
const activeCalculations = results[formData.madhab]; // UI filtering
```

### Benefits
- **Zero Latency Switching:** If a user wants to compare "Hanafi" vs "Shafi'i", the UI can instantly swap the active dashboard. The calculations are already done.
- **Comparison UX:** Enables future features where the user can view side-by-side matrices of how different scholars would calculate their Zakat.
- **Fail-Safe Exports:** PDF and CSV generators can guarantee they are printing the exact mathematical truth of the requested methodology.
