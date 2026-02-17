import { calculateZakat } from '../lib/zakatCalculations';
import { AMJA_CONFIG } from '../lib/config/presets/amja';
import { QARADAWI_CONFIG } from '../lib/config/presets/qaradawi';
import { ZakatFormData } from '../lib/zakatTypes';
import { defaultFormData } from '../lib/calculators/utils';

console.log('--- ZMCS Audit Verification ---\n');

// 1. Verify AMJA Passive Investments (Income Only)
console.log('1. AMJA: Passive Investments (Income Only)');
const amjaData: ZakatFormData = {
    ...defaultFormData,
    passiveInvestmentsValue: 100000,
    dividends: 5000,
    activeInvestments: 0,
    madhab: 'amja',
    nisabStandard: 'silver', // Ensure above Nisab
};

const amjaResult = calculateZakat(amjaData, 30, 2000, AMJA_CONFIG);
console.log(`   Passive Investment Value: $100,000`);
console.log(`   Expected Zakat on Capital: $0.00 (Rate 0.0)`);
console.log(`   Dividends: $5,000`);
console.log(`   Expected Zakat on Dividends: $125.00 (2.5%)`);
console.log(`   Total Zakat Due: $${amjaResult.zakatDue.toFixed(2)}`);

if (Math.abs(amjaResult.zakatDue - 125.00) < 0.01) {
    console.log('   ✅ PASS: AMJA correctly taxes only dividends.');
} else {
    console.error(`   ❌ FAIL: Expected $125.00, got $${amjaResult.zakatDue.toFixed(2)}`);
}

// 2. Verify Qaradawi Rental Income (10% Rate)
console.log('\n2. Qaradawi: Rental Income (10% Rate)');
const qaradawiData: ZakatFormData = {
    ...defaultFormData,
    hasRealEstate: true,
    rentalPropertyIncome: 10000,
    madhab: 'qaradawi',
    nisabStandard: 'silver', // Ensure above Nisab
};

// Mock other assets to ensure Nisab is met if rental income alone doesn't trigger it (though 10k > Nisab usually)
qaradawiData.cashOnHand = 5000;

const qaradawiResult = calculateZakat(qaradawiData, 30, 2000, QARADAWI_CONFIG);
// Expected: 
// Cash: 5000 * 2.5% = 125
// Rental Income: 10000 * 10% = 1000
// Total: 1125

console.log(`   Cash: $5,000 (at 2.5% = $125)`);
console.log(`   Rental Income: $10,000`);
console.log(`   Expected Rental Zakat: $1,000.00 (10%)`);
console.log(`   Total Expected: $1,125.00`);
console.log(`   Calculated Zakat: $${qaradawiResult.zakatDue.toFixed(2)}`);

if (Math.abs(qaradawiResult.zakatDue - 1125.00) < 0.01) {
    console.log('   ✅ PASS: Qaradawi correctly taxes rental income at 10%.');
} else {
    console.error(`   ❌ FAIL: Expected $1125.00, got $${qaradawiResult.zakatDue.toFixed(2)}`);
}

// 3. Verify Tooltip Fields Exist
console.log('\n3. Verification of Tooltip Fields');
const presets = [AMJA_CONFIG, QARADAWI_CONFIG];
let tooltipsPass = true;

presets.forEach(p => {
    if (!p.meta.tooltip) {
        console.error(`   ❌ FAIL: Preset ${p.meta.id} missing meta.tooltip`);
        tooltipsPass = false;
    }
    if (!p.thresholds.nisab.tooltip) {
        console.error(`   ❌ FAIL: Preset ${p.meta.id} missing nisab.tooltip`);
        tooltipsPass = false;
    }
});

if (tooltipsPass) {
    console.log('   ✅ PASS: All checked presets have tooltips.');
}
