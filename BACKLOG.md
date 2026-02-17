# Product Backlog

This document tracks planned features, improvements, and technical debt.

## 🚀 High Priority (Next Actions)

- [ ] **Charity Directory Integration**
    - Search and filter vetted Zakat-eligible organizations.
    - Direct donation links or API integration.
- [ ] **Mobile Responsive Optimization**
    - Refine wizard flow for smaller screens.
    - Touch-optimized drag-and-drop for asset categorization.
- [ ] **Advanced Analytics Dashboard**
    - Year-over-year Zakat trends.
    - Wealth growth visualization.
    - Tax vs Zakat comparative analysis.

## 📋 Planned Features

### Core Calculation
- [ ] **Business Zakat Calculator (Detailed)**
    - Support for Net Current Assets vs NIAG methods.
    - Inventory valuation methods (Cost vs Market).
- [ ] **Inheritance Calculator (Mirath)**
    - Islamic inheritance division calculator based on Faraid rules.
- [ ] **Historical Nisab Data**
    - Interactive chart of Gold/Silver prices over last 10 years.

### Integrations
- [ ] **Crypto Wallet Direct Connect**
    - WalletConnect integration to read balances directly (Metamask, etc.).
- [ ] **Stock Brokerage API**
    - Direct integration with Robinhood/E*TRADE via Plaid Investments (Enhanced).

### Community & Social
- [ ] **Family/Household Accounts**
    - Manage Zakat for multiple family members under one login.
- [ ] **Anonymous Benchmarking**
    - "How do I compare?" (Privacy-preserving wealth tiers).

## 🛠 Technical Debt & Improvements

- [ ] **Unit Test Coverage**
    - Increase coverage for edge cases in `calculators/assets.ts`.
- [ ] **Performance Optimization**
    - Lazy load heavy chart libraries (Nivo).
    - Optimize AI parsing edge function cold start times.
- [ ] **Localization (i18n)**
    - Arabic translation support (RTL layout).
    - Currency conversion/localization beyond USD.
