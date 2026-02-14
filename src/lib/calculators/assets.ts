import {
    ZakatFormData,
    AssetBreakdown,
    EnhancedAssetBreakdown,
    AssetItem,
    LiabilityItem,
} from '../zakatTypes';
import { ZakatMethodologyConfig } from '../config/types';
import { ASSET_COLORS } from './utils';
import { DEFAULT_CONFIG } from '../config/defaults';

// Enhanced Retirement Calculation Logic
export function calculateRetirementAccessible(
    vestedBalance: number,
    age: number,
    taxRate: number,
    config: ZakatMethodologyConfig,
    withdrawalAllowed: boolean = true, // Default true if not passed (backward compat)
    withdrawalLimit: number = 1.0    // Default 100%
): number {
    const rules = config.assets.retirement;

    // 0. Base Check: If funds are fully inaccessible (e.g. company forbids withdrawal), 
    // and methodology requires access (Net Accessible), then result is 0.
    // However, some opinions (Full) might tax even inaccessible wealth? 
    // Usually 'Full' implies ownership is strong regardless of access.
    // 'Net Accessible' implies tax on what you can get.

    // 1. Handle Exemptions
    if (rules.zakatability === 'exempt') return 0;

    // 2. Handle Deferred (Pay upon access)
    // For current year calculation, if not accessing, Zakat is 0.
    if (rules.zakatability === 'deferred_upon_access') return 0;

    // 3. Handle Conditional Age (Bradford / 59.5 Rule)
    if (rules.zakatability === 'conditional_age') {
        const threshold = rules.exemption_age || 59.5;
        if (age < threshold) {
            return 0; // Exempt until age reached
        }
        // If age reached, fall through to Net Accessible logic below
    }

    // 4. Handle Full Amount (Imam Tahir - Strong Ownership)
    // "Full amount" usually means 100% of the vested balance, ignoring taxes/penalties/access limits.
    if (rules.zakatability === 'full') {
        return vestedBalance;
    }

    // 5. Handle Net Accessible (Standard / Majority / Bradford > 59.5)
    // Zakat on what you can put in your pocket today.

    // If withdrawal is strictly forbidden by employer/plan
    if (!withdrawalAllowed) {
        // If strictly forbidden, you have no access. 
        // For 'net_accessible' view, this is effectively 0.
        return 0;
    }

    // Calculate effective access
    // Apply Withdrawal Limit (e.g., only 50% can be withdrawn)
    const accessiblePrincipal = vestedBalance * withdrawalLimit;

    // Apply Penalties & Taxes
    // Default penalty is 10% (0.10) if under 59.5, else 0.
    // Config can override, or we infer standard US rules.
    const isUnderAge = age < 59.5;
    const penalty = (isUnderAge ? (rules.penalty_rate ?? 0.10) : 0);

    // Tax Rate: User provided or flat rate override
    const effectiveTaxRate = rules.tax_rate_source === 'flat_rate' ? 0.30 : taxRate;

    // Net Factor = 1 - (Tax + Penalty)
    const netFactor = Math.max(0, 1 - (effectiveTaxRate + penalty));

    return accessiblePrincipal * netFactor;
}

export function calculateTotalAssets(data: ZakatFormData, config: ZakatMethodologyConfig = DEFAULT_CONFIG): number {
    let total = 0;

    // Module A: Liquid Assets
    if (config.assets.cash.zakatable) {
        total += data.checkingAccounts * config.assets.cash.rate;
        total += data.savingsAccounts * config.assets.cash.rate;
        total += data.cashOnHand * config.assets.cash.rate;
        total += data.digitalWallets * config.assets.cash.rate;
        total += data.foreignCurrency * config.assets.cash.rate;
    }

    // Precious Metals
    if (data.hasPreciousMetals) {
        // Investment Metals
        total += data.goldInvestmentValue * config.assets.precious_metals.investment_gold_rate;
        total += data.silverInvestmentValue * config.assets.precious_metals.investment_silver_rate;

        // Jewelry
        if (config.assets.precious_metals.jewelry.zakatable) {
            total += data.goldJewelryValue * config.assets.precious_metals.jewelry.rate;
            total += data.silverJewelryValue * config.assets.precious_metals.jewelry.rate;
        }
    }

    // Crypto & Digital Assets
    if (data.hasCrypto) {
        const cryptoRules = config.assets.crypto;
        total += data.cryptoCurrency * cryptoRules.currency_rate;
        total += data.cryptoTrading * cryptoRules.trading_rate;

        // Staking
        total += data.stakedAssets * cryptoRules.staking.principal_rate;
        if (cryptoRules.staking.vested_only) {
            total += data.stakedRewardsVested * cryptoRules.staking.rewards_rate;
        } else {
            // If we had unvested, we'd add it here. For now assume form only has Vested.
            total += data.stakedRewardsVested * cryptoRules.staking.rewards_rate;
        }

        total += data.liquidityPoolValue * cryptoRules.trading_rate;
    }

    // Module B: Investments
    const invRules = config.assets.investments;
    total += data.activeInvestments * invRules.active_trading_rate;

    // Passive investments
    total += data.passiveInvestmentsValue * invRules.passive_investments.rate;

    // REITs
    total += data.reitsValue * invRules.reits_rate;

    // Dividends
    if (invRules.dividends.zakatable) {
        let dividends = data.dividends;
        if (invRules.dividends.deduct_purification) {
            dividends -= (data.dividends * (data.dividendPurificationPercent / 100));
        }
        total += dividends;
    }

    // Module C: Retirement Accounts
    // Roth IRA Contributions
    total += data.rothIRAContributions; // Always accessible tax-free

    // Roth IRA Earnings
    if (data.isOver59Half) {
        total += data.rothIRAEarnings;
    } else {
        // Use the shared helper - Roth Earnings subject to penalty/tax if withdrawn early
        total += calculateRetirementAccessible(data.rothIRAEarnings, data.age, data.estimatedTaxRate, config, data.retirementWithdrawalAllowed, data.retirementWithdrawalLimit);
    }

    // Traditional 401k & IRA
    total += calculateRetirementAccessible(data.fourOhOneKVestedBalance, data.age, data.estimatedTaxRate, config, data.retirementWithdrawalAllowed, data.retirementWithdrawalLimit);
    total += calculateRetirementAccessible(data.traditionalIRABalance, data.age, data.estimatedTaxRate, config, data.retirementWithdrawalAllowed, data.retirementWithdrawalLimit);

    // Withdrawals (already net)
    total += data.iraWithdrawals;
    total += data.esaWithdrawals;
    total += data.fiveTwentyNineWithdrawals;
    total += data.hsaBalance;

    // Trusts
    if (data.hasTrusts && config.assets.trusts) {
        total += data.revocableTrustValue * config.assets.trusts.revocable_rate;
        if (data.irrevocableTrustAccessible) {
            total += data.irrevocableTrustValue * config.assets.trusts.irrevocable_rate;
        }
    }

    // Real Estate
    if (data.hasRealEstate) {
        const reRules = config.assets.real_estate;
        if (reRules.for_sale.zakatable) {
            total += data.realEstateForSale * reRules.for_sale.rate;
        }
        if (reRules.land_banking.zakatable) {
            total += data.landBankingValue * reRules.land_banking.rate;
        }
        if (reRules.rental_property.income_zakatable) {
            total += data.rentalPropertyIncome;
        }
    }

    // Business Assets
    if (data.hasBusiness) {
        const bizRules = config.assets.business;
        total += data.businessCashAndReceivables * bizRules.cash_receivables_rate;
        total += data.businessInventory * bizRules.inventory_rate;
    }

    // Illiquid Assets
    if (data.hasIlliquidAssets) {
        const rate = config.assets.illiquid_assets?.rate ?? 1.0;
        total += data.illiquidAssetsValue * rate;
        total += data.livestockValue * rate;
    }

    // Debt Owed To You
    if (data.hasDebtOwedToYou) {
        const debtRules = config.assets.debts_owed_to_user;
        total += data.goodDebtOwedToYou * debtRules.good_debt_rate;

        if (debtRules.bad_debt_on_recovery) {
            total += data.badDebtRecovered;
        } else {
            // If zakatable annually, we'd add bad debt here? Usually no.
        }
    }

    return total;
}

export function calculateEnhancedAssetBreakdown(
    data: ZakatFormData,
    netZakatableWealth: number,
    config: ZakatMethodologyConfig = DEFAULT_CONFIG
): EnhancedAssetBreakdown {
    // Helper to compute percent of net zakatable
    const pctOfNet = (amount: number) =>
        netZakatableWealth > 0 ? amount / netZakatableWealth : 0;

    // Liquid Assets
    const liquidItems: AssetItem[] = [];
    const cashRate = config.assets.cash.rate;
    if (data.checkingAccounts > 0) liquidItems.push({ name: 'Checking Accounts', value: data.checkingAccounts, zakatablePercent: cashRate, zakatableAmount: data.checkingAccounts * cashRate });
    if (data.savingsAccounts > 0) liquidItems.push({ name: 'Savings Accounts', value: data.savingsAccounts, zakatablePercent: cashRate, zakatableAmount: data.savingsAccounts * cashRate });
    if (data.cashOnHand > 0) liquidItems.push({ name: 'Cash on Hand', value: data.cashOnHand, zakatablePercent: cashRate, zakatableAmount: data.cashOnHand * cashRate });
    if (data.digitalWallets > 0) liquidItems.push({ name: 'Digital Wallets', value: data.digitalWallets, zakatablePercent: cashRate, zakatableAmount: data.digitalWallets * cashRate });
    if (data.foreignCurrency > 0) liquidItems.push({ name: 'Foreign Currency', value: data.foreignCurrency, zakatablePercent: cashRate, zakatableAmount: data.foreignCurrency * cashRate });
    const liquidTotal = liquidItems.reduce((s, i) => s + i.value, 0);
    const liquidZakatable = liquidItems.reduce((s, i) => s + (i.zakatableAmount || 0), 0);

    // Precious Metals
    const metalsItems: AssetItem[] = [];
    const metals = config.assets.precious_metals;

    if (data.hasPreciousMetals) {
        if (data.goldInvestmentValue > 0) {
            metalsItems.push({
                name: 'Gold Investment',
                value: data.goldInvestmentValue,
                zakatablePercent: metals.investment_gold_rate,
                zakatableAmount: data.goldInvestmentValue * metals.investment_gold_rate
            });
        }
        if (data.goldJewelryValue > 0) {
            metalsItems.push({
                name: 'Gold Jewelry',
                value: data.goldJewelryValue,
                zakatablePercent: metals.jewelry.zakatable ? metals.jewelry.rate : 0,
                zakatableAmount: metals.jewelry.zakatable ? data.goldJewelryValue * metals.jewelry.rate : 0
            });
        }
        if (data.silverInvestmentValue > 0) {
            metalsItems.push({
                name: 'Silver Investment',
                value: data.silverInvestmentValue,
                zakatablePercent: metals.investment_silver_rate,
                zakatableAmount: data.silverInvestmentValue * metals.investment_silver_rate
            });
        }
        if (data.silverJewelryValue > 0) {
            metalsItems.push({
                name: 'Silver Jewelry',
                value: data.silverJewelryValue,
                zakatablePercent: metals.jewelry.zakatable ? metals.jewelry.rate : 0,
                zakatableAmount: metals.jewelry.zakatable ? data.silverJewelryValue * metals.jewelry.rate : 0
            });
        }
    }
    const metalsTotal = metalsItems.reduce((s, i) => s + i.value, 0);
    const metalsZakatable = metalsItems.reduce((s, i) => s + (i.zakatableAmount || 0), 0);

    // Crypto
    const cryptoItems: AssetItem[] = [];
    const crypto = config.assets.crypto;
    if (data.hasCrypto) {
        if (data.cryptoCurrency > 0) cryptoItems.push({ name: 'Bitcoin/Ethereum', value: data.cryptoCurrency, zakatablePercent: crypto.currency_rate, zakatableAmount: data.cryptoCurrency * crypto.currency_rate });
        if (data.cryptoTrading > 0) cryptoItems.push({ name: 'Trading Altcoins', value: data.cryptoTrading, zakatablePercent: crypto.trading_rate, zakatableAmount: data.cryptoTrading * crypto.trading_rate });
        if (data.stakedAssets > 0) cryptoItems.push({ name: 'Staked Assets', value: data.stakedAssets, zakatablePercent: crypto.staking.principal_rate, zakatableAmount: data.stakedAssets * crypto.staking.principal_rate });
        if (data.stakedRewardsVested > 0) cryptoItems.push({ name: 'Staking Rewards', value: data.stakedRewardsVested, zakatablePercent: crypto.staking.rewards_rate, zakatableAmount: data.stakedRewardsVested * crypto.staking.rewards_rate });
        if (data.liquidityPoolValue > 0) cryptoItems.push({ name: 'Liquidity Pools', value: data.liquidityPoolValue, zakatablePercent: crypto.trading_rate, zakatableAmount: data.liquidityPoolValue * crypto.trading_rate });
    }
    const cryptoTotal = cryptoItems.reduce((s, i) => s + i.value, 0);
    const cryptoZakatable = cryptoItems.reduce((s, i) => s + (i.zakatableAmount || 0), 0);

    // Investments
    const investmentItems: AssetItem[] = [];
    const inv = config.assets.investments;

    if (data.activeInvestments > 0) investmentItems.push({ name: 'Active Investments', value: data.activeInvestments, zakatablePercent: inv.active_trading_rate, zakatableAmount: data.activeInvestments * inv.active_trading_rate });
    if (data.passiveInvestmentsValue > 0) investmentItems.push({
        name: 'Passive Investments',
        value: data.passiveInvestmentsValue,
        zakatablePercent: inv.passive_investments.rate,
        zakatableAmount: data.passiveInvestmentsValue * inv.passive_investments.rate
    });

    // Dividends
    let divZakatable = 0;
    let divPercent = 0;
    if (data.dividends > 0) {
        if (inv.dividends.zakatable) {
            divZakatable = data.dividends;
            if (inv.dividends.deduct_purification) {
                divZakatable -= (data.dividends * data.dividendPurificationPercent / 100);
            }
            divPercent = divZakatable / data.dividends;
        }
        investmentItems.push({
            name: 'Dividends',
            value: data.dividends,
            zakatableAmount: divZakatable,
            zakatablePercent: divPercent
        });
    }

    // REITs
    if (data.reitsValue > 0) investmentItems.push({
        name: 'REITs (Equity)',
        value: data.reitsValue,
        zakatablePercent: inv.reits_rate,
        zakatableAmount: data.reitsValue * inv.reits_rate
    });

    const investmentGross = investmentItems.reduce((s, i) => s + i.value, 0);
    const investmentZakatable = investmentItems.reduce((s, i) => s + (i.zakatableAmount || 0), 0);

    // Retirement
    const retirementItems: AssetItem[] = [];
    // Contributions
    if (data.rothIRAContributions > 0) retirementItems.push({ name: 'Roth IRA Contributions', value: data.rothIRAContributions, zakatablePercent: 1.0, zakatableAmount: data.rothIRAContributions }); // Rule: Contributions always accessible

    // Earnings
    const rothEarningsZakatable = data.isOver59Half ? data.rothIRAEarnings : calculateRetirementAccessible(data.rothIRAEarnings, data.age, data.estimatedTaxRate, config, data.retirementWithdrawalAllowed, data.retirementWithdrawalLimit);
    if (data.rothIRAEarnings > 0) retirementItems.push({
        name: 'Roth IRA Earnings',
        value: data.rothIRAEarnings,
        zakatableAmount: rothEarningsZakatable,
        zakatablePercent: rothEarningsZakatable / data.rothIRAEarnings
    });

    const fourOhOneKZakatable = calculateRetirementAccessible(data.fourOhOneKVestedBalance, data.age, data.estimatedTaxRate, config, data.retirementWithdrawalAllowed, data.retirementWithdrawalLimit);
    if (data.fourOhOneKVestedBalance > 0) retirementItems.push({
        name: '401(k) Vested',
        value: data.fourOhOneKVestedBalance,
        zakatableAmount: fourOhOneKZakatable,
        zakatablePercent: fourOhOneKZakatable / data.fourOhOneKVestedBalance
    });

    const iraZakatable = calculateRetirementAccessible(data.traditionalIRABalance, data.age, data.estimatedTaxRate, config, data.retirementWithdrawalAllowed, data.retirementWithdrawalLimit);
    if (data.traditionalIRABalance > 0) retirementItems.push({
        name: 'Traditional IRA',
        value: data.traditionalIRABalance,
        zakatableAmount: iraZakatable,
        zakatablePercent: iraZakatable / data.traditionalIRABalance
    });

    // Withdrawals (already net)
    if (data.iraWithdrawals > 0) retirementItems.push({ name: 'IRA Withdrawals', value: data.iraWithdrawals, zakatablePercent: 1.0, zakatableAmount: data.iraWithdrawals });
    if (data.esaWithdrawals > 0) retirementItems.push({ name: 'ESA Withdrawals', value: data.esaWithdrawals, zakatablePercent: 1.0, zakatableAmount: data.esaWithdrawals });
    if (data.fiveTwentyNineWithdrawals > 0) retirementItems.push({ name: '529 Withdrawals', value: data.fiveTwentyNineWithdrawals, zakatablePercent: 1.0, zakatableAmount: data.fiveTwentyNineWithdrawals });
    if (data.hsaBalance > 0) retirementItems.push({ name: 'HSA Balance', value: data.hsaBalance, zakatablePercent: 1.0, zakatableAmount: data.hsaBalance });

    const retirementGross = retirementItems.reduce((s, i) => s + i.value, 0);
    const retirementZakatable = retirementItems.reduce((s, i) => s + (i.zakatableAmount || 0), 0);

    // Trusts
    const trustItems: AssetItem[] = [];
    const trusts = config.assets.trusts || { revocable_rate: 1.0, irrevocable_rate: 1.0 }; // safety default

    if (data.hasTrusts) {
        if (data.revocableTrustValue > 0) trustItems.push({ name: 'Revocable Trust', value: data.revocableTrustValue, zakatablePercent: trusts.revocable_rate, zakatableAmount: data.revocableTrustValue * trusts.revocable_rate });
        if (data.irrevocableTrustAccessible && data.irrevocableTrustValue > 0) {
            trustItems.push({ name: 'Irrevocable Trust (Accessible)', value: data.irrevocableTrustValue, zakatablePercent: trusts.irrevocable_rate, zakatableAmount: data.irrevocableTrustValue * trusts.irrevocable_rate });
        }
    }
    const trustsTotal = trustItems.reduce((s, i) => s + i.value, 0);
    const trustsZakatable = trustItems.reduce((s, i) => s + (i.zakatableAmount || 0), 0);

    // Real Estate
    const realEstateItems: AssetItem[] = [];
    const re = config.assets.real_estate;
    if (data.hasRealEstate) {
        if (data.realEstateForSale > 0) realEstateItems.push({ name: 'Property for Sale (Flipping)', value: data.realEstateForSale, zakatablePercent: re.for_sale.rate, zakatableAmount: data.realEstateForSale * re.for_sale.rate });
        if (data.landBankingValue > 0) realEstateItems.push({ name: 'Land Banking / Appreciation', value: data.landBankingValue, zakatablePercent: re.land_banking.rate, zakatableAmount: data.landBankingValue * re.land_banking.rate });
        if (data.rentalPropertyIncome > 0) realEstateItems.push({ name: 'Rental Income', value: data.rentalPropertyIncome, zakatablePercent: re.rental_property.income_zakatable ? 1.0 : 0, zakatableAmount: re.rental_property.income_zakatable ? data.rentalPropertyIncome : 0 });
    }
    const realEstateTotal = realEstateItems.reduce((s, i) => s + i.value, 0);
    const realEstateZakatable = realEstateItems.reduce((s, i) => s + (i.zakatableAmount || 0), 0);

    // Business
    const businessItems: AssetItem[] = [];
    const biz = config.assets.business;
    if (data.hasBusiness) {
        if (data.businessCashAndReceivables > 0) businessItems.push({ name: 'Cash & Receivables', value: data.businessCashAndReceivables, zakatablePercent: biz.cash_receivables_rate, zakatableAmount: data.businessCashAndReceivables * biz.cash_receivables_rate });
        if (data.businessInventory > 0) businessItems.push({ name: 'Inventory', value: data.businessInventory, zakatablePercent: biz.inventory_rate, zakatableAmount: data.businessInventory * biz.inventory_rate });
    }
    const businessTotal = businessItems.reduce((s, i) => s + i.value, 0);
    const businessZakatable = businessItems.reduce((s, i) => s + (i.zakatableAmount || 0), 0);

    // Debt Owed To You
    const debtOwedItems: AssetItem[] = [];
    const debt = config.assets.debts_owed_to_user;
    if (data.hasDebtOwedToYou) {
        if (data.goodDebtOwedToYou > 0) debtOwedItems.push({ name: 'Collectible Loans', value: data.goodDebtOwedToYou, zakatablePercent: debt.good_debt_rate, zakatableAmount: data.goodDebtOwedToYou * debt.good_debt_rate });
        if (data.badDebtRecovered > 0) debtOwedItems.push({ name: 'Recovered Bad Debt', value: data.badDebtRecovered, zakatablePercent: 1.0, zakatableAmount: data.badDebtRecovered }); // Always 1.0 on recovery usually
    }
    const debtOwedTotal = debtOwedItems.reduce((s, i) => s + i.value, 0);
    const debtOwedZakatable = debtOwedItems.reduce((s, i) => s + (i.zakatableAmount || 0), 0);

    // Illiquid Assets
    const illiquidItems: AssetItem[] = [];
    const illiquidRate = config.assets.illiquid_assets?.rate ?? 1.0;
    if (data.hasIlliquidAssets) {
        if (data.illiquidAssetsValue > 0) illiquidItems.push({ name: 'Illiquid Assets', value: data.illiquidAssetsValue, zakatablePercent: illiquidRate, zakatableAmount: data.illiquidAssetsValue * illiquidRate });
        if (data.livestockValue > 0) illiquidItems.push({ name: 'Livestock', value: data.livestockValue, zakatablePercent: illiquidRate, zakatableAmount: data.livestockValue * illiquidRate });
    }
    const illiquidTotal = illiquidItems.reduce((s, i) => s + i.value, 0);
    const illiquidZakatable = illiquidItems.reduce((s, i) => s + (i.zakatableAmount || 0), 0);

    // Liabilities (Placeholder)
    const liabilityItems: LiabilityItem[] = [];
    if (data.monthlyLivingExpenses > 0) liabilityItems.push({ name: 'Living Expenses', value: data.monthlyLivingExpenses });
    if (data.insuranceExpenses > 0) liabilityItems.push({ name: 'Insurance', value: data.insuranceExpenses });
    if (data.creditCardBalance > 0) liabilityItems.push({ name: 'Credit Card', value: data.creditCardBalance });
    if (data.unpaidBills > 0) liabilityItems.push({ name: 'Unpaid Bills', value: data.unpaidBills });
    if (data.monthlyMortgage > 0) liabilityItems.push({ name: 'Mortgage (12mo)', value: data.monthlyMortgage * 12 });
    if (data.studentLoansDue > 0) liabilityItems.push({ name: 'Student Loans', value: data.studentLoansDue });
    if (data.hasTaxPayments && data.propertyTax > 0) liabilityItems.push({ name: 'Property Tax', value: data.propertyTax });
    if (data.hasTaxPayments && data.lateTaxPayments > 0) liabilityItems.push({ name: 'Late Taxes', value: data.lateTaxPayments });
    const liabilitiesTotal = liabilityItems.reduce((s, i) => s + i.value, 0);

    // Exempt Assets (Informational)
    const exemptItems: AssetItem[] = [];
    if (data.fourOhOneKUnvestedMatch > 0) exemptItems.push({ name: '401(k) Unvested', value: data.fourOhOneKUnvestedMatch });
    if (data.clatValue > 0) exemptItems.push({ name: 'CLAT', value: data.clatValue });
    if (data.hasTrusts && !data.irrevocableTrustAccessible && data.irrevocableTrustValue > 0) {
        exemptItems.push({ name: 'Irrevocable Trust', value: data.irrevocableTrustValue });
    }
    const exemptTotal = exemptItems.reduce((s, i) => s + i.value, 0);

    return {
        liquidAssets: {
            label: 'Cash & Savings',
            color: ASSET_COLORS.liquid,
            total: liquidTotal,
            zakatableAmount: liquidZakatable,
            zakatablePercent: liquidTotal > 0 ? liquidZakatable / liquidTotal : 1.0,
            percentOfNetZakatable: pctOfNet(liquidZakatable),
            items: liquidItems,
        },
        preciousMetals: {
            label: 'Precious Metals',
            color: ASSET_COLORS.metals,
            total: metalsTotal,
            zakatableAmount: metalsZakatable,
            zakatablePercent: metalsTotal > 0 ? metalsZakatable / metalsTotal : 1.0,
            percentOfNetZakatable: pctOfNet(metalsZakatable),
            items: metalsItems,
        },
        crypto: {
            label: 'Crypto & Digital',
            color: ASSET_COLORS.crypto,
            total: cryptoTotal,
            zakatableAmount: cryptoZakatable,
            zakatablePercent: cryptoTotal > 0 ? cryptoZakatable / cryptoTotal : 1.0,
            percentOfNetZakatable: pctOfNet(cryptoZakatable),
            items: cryptoItems,
        },
        investments: {
            label: 'Investments',
            color: ASSET_COLORS.investments,
            total: investmentGross,
            zakatableAmount: investmentZakatable,
            zakatablePercent: investmentGross > 0 ? investmentZakatable / investmentGross : 1.0,
            percentOfNetZakatable: pctOfNet(investmentZakatable),
            items: investmentItems,
        },
        retirement: {
            label: 'Retirement',
            color: ASSET_COLORS.retirement,
            total: retirementGross,
            zakatableAmount: retirementZakatable,
            zakatablePercent: retirementGross > 0 ? retirementZakatable / retirementGross : 0,
            percentOfNetZakatable: pctOfNet(retirementZakatable),
            items: retirementItems,
        },
        trusts: {
            label: 'Trusts',
            color: ASSET_COLORS.trusts,
            total: trustsTotal,
            zakatableAmount: trustsZakatable,
            zakatablePercent: trustsTotal > 0 ? trustsZakatable / trustsTotal : 1.0,
            percentOfNetZakatable: pctOfNet(trustsZakatable),
            items: trustItems,
        },
        realEstate: {
            label: 'Real Estate',
            color: ASSET_COLORS.realEstate,
            total: realEstateTotal,
            zakatableAmount: realEstateZakatable,
            zakatablePercent: realEstateTotal > 0 ? realEstateZakatable / realEstateTotal : 1.0,
            percentOfNetZakatable: pctOfNet(realEstateZakatable),
            items: realEstateItems,
        },
        business: {
            label: 'Business',
            color: ASSET_COLORS.business,
            total: businessTotal,
            zakatableAmount: businessZakatable,
            zakatablePercent: businessTotal > 0 ? businessZakatable / businessTotal : 1.0,
            percentOfNetZakatable: pctOfNet(businessZakatable),
            items: businessItems,
        },
        debtOwedToYou: {
            label: 'Debt Owed to You',
            color: ASSET_COLORS.debtOwed,
            total: debtOwedTotal,
            zakatableAmount: debtOwedZakatable,
            zakatablePercent: debtOwedTotal > 0 ? debtOwedZakatable / debtOwedTotal : 1.0,
            percentOfNetZakatable: pctOfNet(debtOwedZakatable),
            items: debtOwedItems,
        },
        illiquidAssets: {
            label: 'Illiquid Assets',
            color: ASSET_COLORS.illiquid,
            total: illiquidTotal,
            zakatableAmount: illiquidZakatable,
            zakatablePercent: illiquidTotal > 0 ? illiquidZakatable / illiquidTotal : 1.0,
            percentOfNetZakatable: pctOfNet(illiquidZakatable),
            items: illiquidItems,
        },
        liabilities: {
            label: 'Deductions',
            color: ASSET_COLORS.liabilities,
            total: liabilitiesTotal,
            items: liabilityItems,
        },
        exempt: {
            label: 'Exempt Assets',
            color: ASSET_COLORS.exempt,
            total: exemptTotal,
            items: exemptItems,
        },
    };
}

// Deprecated in favor of enhanced breakdown but kept for backward compatibility if needed
export function calculateAssetBreakdown(data: ZakatFormData, config: ZakatMethodologyConfig = DEFAULT_CONFIG): AssetBreakdown {
    // Re-implemented to use the logic, though mostly redundant with enhanced
    const enhanced = calculateEnhancedAssetBreakdown(data, 100, config); // dummy net wealth
    return {
        liquidAssets: enhanced.liquidAssets.zakatableAmount + enhanced.preciousMetals.zakatableAmount + enhanced.crypto.zakatableAmount,
        investments: enhanced.investments.zakatableAmount,
        retirement: enhanced.retirement.zakatableAmount,
        realEstate: enhanced.realEstate.zakatableAmount,
        business: enhanced.business.zakatableAmount,
        otherAssets: enhanced.trusts.zakatableAmount + enhanced.illiquidAssets.zakatableAmount + enhanced.debtOwedToYou.zakatableAmount,
        exemptAssets: enhanced.exempt.total
    };
}
