// Standalone Test Script with Embedded Logic
// Copied from src/lib/calculators/assets.ts to avoid import issues

function calculateRetirementAccessible(
    vestedBalance,
    age,
    taxRate,
    config,
    withdrawalAllowed = true,
    withdrawalLimit = 1.0
) {
    const rules = config.assets.retirement;

    // 0. Base Check
    // 1. Handle Exemptions
    if (rules.zakatability === 'exempt') return 0;

    // 2. Handle Deferred (Pay upon access)
    if (rules.zakatability === 'deferred_upon_access') return 0;

    // 3. Handle Conditional Age (Bradford / 59.5 Rule)
    if (rules.zakatability === 'conditional_age') {
        const threshold = rules.exemption_age || 59.5;
        if (age < threshold) {
            return 0; // Exempt until age reached
        }
    }

    // 4. Handle Full Amount (Imam Tahir - Strong Ownership)
    if (rules.zakatability === 'full') {
        return vestedBalance;
    }

    // 5. Handle Net Accessible (Standard / Majority / Bradford > 59.5)

    // If withdrawal is strictly forbidden by employer/plan
    if (!withdrawalAllowed) {
        return 0;
    }

    // Calculate effective access
    const accessiblePrincipal = vestedBalance * withdrawalLimit;

    // Apply Penalties & Taxes
    const isUnderAge = age < 59.5;
    const penalty = (isUnderAge ? (rules.penalty_rate ?? 0.10) : 0);

    const effectiveTaxRate = rules.tax_rate_source === 'flat_rate' ? 0.30 : taxRate;

    // Net Factor = 1 - (Tax + Penalty)
    const netFactor = Math.max(0, 1 - (effectiveTaxRate + penalty));

    return accessiblePrincipal * netFactor;
}

// Mock Config Minimal
const mockConfig = {
    assets: {
        retirement: {
            zakatability: 'full',
            penalty_rate: 0.10,
            tax_rate_source: 'user_input',
            exemption_age: 59.5
        }
    }
};

let failed = false;

function runTest(name, vested, age, taxRate, zakatability, withdrawalAllowed, withdrawalLimit, expected) {
    mockConfig.assets.retirement.zakatability = zakatability;

    // Reset defaults for consistent testing
    mockConfig.assets.retirement.penalty_rate = 0.10;
    mockConfig.assets.retirement.exemption_age = 59.5;
    mockConfig.assets.retirement.tax_rate_source = 'user_input';

    const result = calculateRetirementAccessible(vested, age, taxRate, mockConfig, withdrawalAllowed, withdrawalLimit);

    // Precision check
    const pass = Math.abs(result - expected) < 0.01;

    if (pass) {
        console.log(`PASS: ${name}`);
    } else {
        console.error(`FAIL: ${name} -> Expected ${expected}, Got ${result}`);
        failed = true;
    }
}

const VESTED = 10000;
const TAX = 0.25;

console.log("--- Retirement Verification ---");

// 1. Full Amount
runTest("Full Amount", VESTED, 40, TAX, 'full', true, 1.0, VESTED);
runTest("Full Amount (No Withdrawal)", VESTED, 40, TAX, 'full', false, 1.0, VESTED);

// 2. Net Accessible
// Standard: Vested * (1 - Tax - Penalty) -> 10000 * (1 - 0.25 - 0.10) = 6500
runTest("Net Accessible (Under Age)", VESTED, 40, TAX, 'net_accessible', true, 1.0, 6500);

// Over Age: No penalty -> 10000 * (1 - 0.25) = 7500
runTest("Net Accessible (Over Age)", VESTED, 60, TAX, 'net_accessible', true, 1.0, 7500);

// Withdrawal Not Allowed -> 0
runTest("Net Accessible (No Withdrawal)", VESTED, 40, TAX, 'net_accessible', false, 1.0, 0);

// Withdrawal Limit 50% -> 10000 * 0.5 * 0.65 = 3250
runTest("Net Accessible (50% Limit)", VESTED, 40, TAX, 'net_accessible', true, 0.5, 3250);

// 3. Conditional Age
// Under 59.5 -> 0
runTest("Conditional Age (Under)", VESTED, 40, TAX, 'conditional_age', true, 1.0, 0);

// Over 59.5 -> Net Accessible Logic (7500)
runTest("Conditional Age (Over)", VESTED, 60, TAX, 'conditional_age', true, 1.0, 7500);

// 4. Exempt -> 0
runTest("Exempt", VESTED, 40, TAX, 'exempt', true, 1.0, 0);

// 5. Deferred -> 0
runTest("Deferred", VESTED, 40, TAX, 'deferred_upon_access', true, 1.0, 0);

if (failed) {
    console.error("Some tests failed.");
    process.exit(1);
} else {
    console.log("SUCCESS: All retirement logic verified.");
}
