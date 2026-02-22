# 1-Pager: P0 Production Calculation Bug

## Problem Statement
The production ZakatFlow application is returning **$0 Zakat Due** for users when calculating under the Imam Tahir Anwar and Sheikh Joe Bradford methodologies, despite the user having substantial assets ($147.1K). Furthermore, examining the Zakat Report screen triggers fatal CSP (Content Security Policy) and iframe errors in the console, causing rendering issues.

## Target Audience
All users attempting to calculate Zakat using the Bradford or Anwar methodologies, particularly those with retirement accounts and substantial liabilities.

## Value Proposition
Fixing this restores the core utility of the application. Calculating $0 incorrectly represents a severe legal and fiduciary failure under the Fiqh compliance guidelines.

## High-Level Metrics
- **Objective:** Restore accurate calculation outputs for all 3 methodologies.
- **KPI:** 0 console errors during report generation, 100% test coverage on the affected calculation vectors.

## MVP Scope (Bug Fixes)
1. **Calculation Fix:** The logs indicate the liabilities are disproportionately high (`Total deductible liabilities: ($241,000)`) against the total assets, driving Wealth to Purify below Nisab ($0). The logic determining deductible liabilities for Anwar and Bradford must be corrected.
2. **CSP/Iframe Fix:** The Lovable iframe and `cdn.gpteng.co/lovable.js` scripts are being blocked by strict CSP headers, breaking the UI. These headers must be relaxed or the external dependencies removed if they are unnecessary.

## Evidence
**Zakat Report Export**
```csv
ZAKATFLOW REPORT
Generated,"Feb 22, 2026, 10:13:09 AM"
For Google Sheets,Import this file via File > Import > Upload. Formulas are not embedded for security.

CALCULATION SUMMARY
Metric,Value,Notes
Total Gross Assets,"147130.78",All assets before deductions/exemptions
Total Liabilities,"241000.00",Deductible debts/expenses
Net Zakatable Wealth,"0.00",Wealth subject to Zakat
Zakat Due,"0.00",2.5% of Net Zakatable Wealth

MARKET PRICES USED
Metal,Price per Troy Ounce (USD),Last Updated
Gold,"2650.00","Default"
Silver,"30.00","Default"

ASSET BREAKDOWN
Category,Item / Sub-Category,Gross Value,Zakatable %,Zakatable Amount,Methodology Rule
"Cash & Savings","Checking Accounts","10000.00","100%","10000.00","Fully accessible liquidity"
"Cash & Savings","Savings Accounts","1000.00","100%","1000.00","Fully accessible liquidity"
"Cash & Savings","Cash on Hand","2500.00","100%","2500.00","Fully accessible liquidity"
"Investments","Passive Investments","10000.00","100%","10000.00","100% Market Value"
"Investments","Dividends","10000.00","100%","10000.00","100% Market Value"
"Investments","REITs (Equity)","10000.00","100%","10000.00","100% Market Value"
"Retirement","Roth IRA Contributions","10000.00","100%","10000.00","Full Vested Balance"
"Retirement","Roth IRA Earnings","10000.00","100%","10000.00","Full Vested Balance"
"Retirement","401(k) Vested","10000.00","100%","10000.00","Full Vested Balance"
"Retirement","Traditional IRA","10000.00","100%","10000.00","Full Vested Balance"
"Precious Metals","Gold Investment","15753.85","100%","15753.85","Gold & Silver Holdings (Zakatable)"
"Precious Metals","Gold Jewelry","7876.93","100%","7876.93","Gold & Silver Holdings (Zakatable)"
"Crypto & Digital","Bitcoin/Ethereum","10000.00","100%","10000.00","Digital Currency & Tokens"
"Crypto & Digital","Trading Altcoins","10000.00","100%","10000.00","Digital Currency & Tokens"
"Crypto & Digital","Staked Assets","10000.00","100%","10000.00","Digital Currency & Tokens"
"Crypto & Digital","Staking Rewards","10000.00","100%","10000.00","Digital Currency & Tokens"

LIABILITIES DEDUCTED
Type,Description,Amount,Deductible %,Deduction,Rule

METHODOLOGY GLOSSARY
Selected Methodology,"Imam Tahir Anwar (Hanafi)"
Core Principle,"See Methodology page for details"
```
