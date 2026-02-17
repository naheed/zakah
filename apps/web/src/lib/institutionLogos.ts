/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * US Financial Institution Logo Database
 * 
 * Contains top 100 US banks, brokerages, credit unions, and financial services.
 * Logos sourced from public domains (favicons). Fallback to icon type.
 */

export interface Institution {
    id: string;
    displayName: string;
    aliases: string[];
    domain: string;
    /** Optional hosted logo URL - uses favicon if not specified */
    logoUrl?: string;
    type: 'bank' | 'brokerage' | 'credit_union' | 'crypto' | 'insurance' | 'other';
}

/**
 * Get favicon URL from domain (using Google's favicon service)
 */
export function getFaviconUrl(domain: string, size: number = 64): string {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

/**
 * Top 100 US Financial Institutions
 * Sorted alphabetically for easy maintenance
 */
export const INSTITUTIONS: Institution[] = [
    // Major Banks
    { id: 'ally', displayName: 'Ally Bank', aliases: ['ally', 'ally bank', 'ally financial'], domain: 'ally.com', type: 'bank' },
    { id: 'amex', displayName: 'American Express', aliases: ['amex', 'american express', 'americanexpress'], domain: 'americanexpress.com', type: 'bank' },
    { id: 'bankofamerica', displayName: 'Bank of America', aliases: ['bank of america', 'boa', 'bofa', 'bankofamerica'], domain: 'bankofamerica.com', type: 'bank' },
    { id: 'barclays', displayName: 'Barclays', aliases: ['barclays', 'barclays us'], domain: 'barclays.com', type: 'bank' },
    { id: 'bbva', displayName: 'BBVA', aliases: ['bbva', 'bbva usa'], domain: 'bbvausa.com', type: 'bank' },
    { id: 'bmo', displayName: 'BMO', aliases: ['bmo', 'bmo harris', 'bmo harris bank'], domain: 'bmo.com', type: 'bank' },
    { id: 'capitalOne', displayName: 'Capital One', aliases: ['capital one', 'capitalone', 'cap one'], domain: 'capitalone.com', type: 'bank' },
    { id: 'chase', displayName: 'Chase', aliases: ['chase', 'jpmorgan', 'jp morgan', 'jpmorgan chase', 'jpm'], domain: 'chase.com', type: 'bank' },
    { id: 'citi', displayName: 'Citibank', aliases: ['citi', 'citibank', 'citigroup'], domain: 'citi.com', type: 'bank' },
    { id: 'citizens', displayName: 'Citizens Bank', aliases: ['citizens', 'citizens bank', 'citizens financial'], domain: 'citizensbank.com', type: 'bank' },
    { id: 'discover', displayName: 'Discover', aliases: ['discover', 'discover bank', 'discover card'], domain: 'discover.com', type: 'bank' },
    { id: 'fifththird', displayName: 'Fifth Third Bank', aliases: ['fifth third', 'fifththird', '5/3', '53'], domain: 'fifththird.com', type: 'bank' },
    { id: 'firstrepublic', displayName: 'First Republic', aliases: ['first republic', 'firstrepublic'], domain: 'firstrepublic.com', type: 'bank' },
    { id: 'goldman', displayName: 'Goldman Sachs', aliases: ['goldman', 'goldman sachs', 'gs', 'marcus'], domain: 'goldmansachs.com', type: 'bank' },
    { id: 'hsbc', displayName: 'HSBC', aliases: ['hsbc', 'hsbc usa', 'hsbc bank'], domain: 'hsbc.com', type: 'bank' },
    { id: 'huntington', displayName: 'Huntington Bank', aliases: ['huntington', 'huntington bank'], domain: 'huntington.com', type: 'bank' },
    { id: 'keybank', displayName: 'KeyBank', aliases: ['keybank', 'key bank', 'keycorp'], domain: 'key.com', type: 'bank' },
    { id: 'marcus', displayName: 'Marcus by Goldman Sachs', aliases: ['marcus'], domain: 'marcus.com', type: 'bank' },
    { id: 'mtb', displayName: 'M&T Bank', aliases: ['m&t', 'mt bank', 'm&t bank', 'mtb'], domain: 'mtb.com', type: 'bank' },
    { id: 'navyfcu', displayName: 'Navy Federal', aliases: ['navy federal', 'nfcu', 'navy federal credit union'], domain: 'navyfederal.org', type: 'credit_union' },
    { id: 'pnc', displayName: 'PNC Bank', aliases: ['pnc', 'pnc bank', 'pnc financial'], domain: 'pnc.com', type: 'bank' },
    { id: 'regions', displayName: 'Regions Bank', aliases: ['regions', 'regions bank'], domain: 'regions.com', type: 'bank' },
    { id: 'sofi', displayName: 'SoFi', aliases: ['sofi', 'social finance'], domain: 'sofi.com', type: 'bank' },
    { id: 'svb', displayName: 'Silicon Valley Bank', aliases: ['svb', 'silicon valley bank'], domain: 'svb.com', type: 'bank' },
    { id: 'synchrony', displayName: 'Synchrony Bank', aliases: ['synchrony', 'synchrony bank'], domain: 'synchrony.com', type: 'bank' },
    { id: 'td', displayName: 'TD Bank', aliases: ['td', 'td bank', 'td ameritrade'], domain: 'td.com', type: 'bank' },
    { id: 'truist', displayName: 'Truist', aliases: ['truist', 'suntrust', 'bb&t'], domain: 'truist.com', type: 'bank' },
    { id: 'usaa', displayName: 'USAA', aliases: ['usaa'], domain: 'usaa.com', type: 'bank' },
    { id: 'usbank', displayName: 'US Bank', aliases: ['us bank', 'usbank', 'u.s. bank'], domain: 'usbank.com', type: 'bank' },
    { id: 'wellsfargo', displayName: 'Wells Fargo', aliases: ['wells fargo', 'wellsfargo', 'wfc'], domain: 'wellsfargo.com', type: 'bank' },
    { id: 'wealthfront', displayName: 'Wealthfront', aliases: ['wealthfront'], domain: 'wealthfront.com', type: 'bank' },
    { id: 'chime', displayName: 'Chime', aliases: ['chime', 'chime bank'], domain: 'chime.com', type: 'bank' },

    // Brokerages
    { id: 'betterment', displayName: 'Betterment', aliases: ['betterment'], domain: 'betterment.com', type: 'brokerage' },
    { id: 'etrade', displayName: 'E*TRADE', aliases: ['etrade', 'e*trade', 'e trade'], domain: 'etrade.com', type: 'brokerage' },
    { id: 'fidelity', displayName: 'Fidelity', aliases: ['fidelity', 'fidelity investments'], domain: 'fidelity.com', type: 'brokerage' },
    { id: 'firstrade', displayName: 'Firstrade', aliases: ['firstrade'], domain: 'firstrade.com', type: 'brokerage' },
    { id: 'ibkr', displayName: 'Interactive Brokers', aliases: ['interactive brokers', 'ibkr', 'ib'], domain: 'interactivebrokers.com', type: 'brokerage' },
    { id: 'merrilledge', displayName: 'Merrill Edge', aliases: ['merrill', 'merrill edge', 'merrill lynch'], domain: 'merrilledge.com', type: 'brokerage' },
    { id: 'morganstanley', displayName: 'Morgan Stanley', aliases: ['morgan stanley', 'morganstanley', 'ms'], domain: 'morganstanley.com', type: 'brokerage' },
    { id: 'personalcapital', displayName: 'Empower', aliases: ['personal capital', 'empower', 'empower personal capital'], domain: 'empower.com', type: 'brokerage' },
    { id: 'public', displayName: 'Public', aliases: ['public', 'public.com'], domain: 'public.com', type: 'brokerage' },
    { id: 'robinhood', displayName: 'Robinhood', aliases: ['robinhood', 'robinhood markets'], domain: 'robinhood.com', type: 'brokerage' },
    { id: 'schwab', displayName: 'Charles Schwab', aliases: ['schwab', 'charles schwab', 'charlesschwab'], domain: 'schwab.com', type: 'brokerage' },
    { id: 'tastyworks', displayName: 'tastytrade', aliases: ['tastytrade', 'tastyworks'], domain: 'tastytrade.com', type: 'brokerage' },
    { id: 'tradier', displayName: 'Tradier', aliases: ['tradier'], domain: 'tradier.com', type: 'brokerage' },
    { id: 'trowe', displayName: 'T. Rowe Price', aliases: ['t rowe price', 'troweprice', 't. rowe price'], domain: 'troweprice.com', type: 'brokerage' },
    { id: 'vanguard', displayName: 'Vanguard', aliases: ['vanguard'], domain: 'vanguard.com', type: 'brokerage' },
    { id: 'webull', displayName: 'Webull', aliases: ['webull'], domain: 'webull.com', type: 'brokerage' },

    // Crypto
    { id: 'binance', displayName: 'Binance.US', aliases: ['binance', 'binance us', 'binance.us'], domain: 'binance.us', type: 'crypto' },
    { id: 'bitfinex', displayName: 'Bitfinex', aliases: ['bitfinex'], domain: 'bitfinex.com', type: 'crypto' },
    { id: 'bitstamp', displayName: 'Bitstamp', aliases: ['bitstamp'], domain: 'bitstamp.net', type: 'crypto' },
    { id: 'blockchain', displayName: 'Blockchain.com', aliases: ['blockchain', 'blockchain.com'], domain: 'blockchain.com', type: 'crypto' },
    { id: 'coinbase', displayName: 'Coinbase', aliases: ['coinbase', 'coinbase pro'], domain: 'coinbase.com', type: 'crypto' },
    { id: 'cryptocom', displayName: 'Crypto.com', aliases: ['crypto.com', 'cryptocom'], domain: 'crypto.com', type: 'crypto' },
    { id: 'gemini', displayName: 'Gemini', aliases: ['gemini', 'gemini exchange'], domain: 'gemini.com', type: 'crypto' },
    { id: 'kraken', displayName: 'Kraken', aliases: ['kraken'], domain: 'kraken.com', type: 'crypto' },
    { id: 'ledger', displayName: 'Ledger', aliases: ['ledger', 'ledger live'], domain: 'ledger.com', type: 'crypto' },

    // Credit Unions (Major)
    { id: 'alliant', displayName: 'Alliant Credit Union', aliases: ['alliant', 'alliant credit union'], domain: 'alliantcreditunion.org', type: 'credit_union' },
    { id: 'becu', displayName: 'BECU', aliases: ['becu', 'boeing employees credit union'], domain: 'becu.org', type: 'credit_union' },
    { id: 'dccu', displayName: 'Digital Credit Union', aliases: ['dcu', 'digital credit union', 'dccu'], domain: 'dcu.org', type: 'credit_union' },
    { id: 'penfed', displayName: 'PenFed', aliases: ['penfed', 'pentagon federal', 'pentagon federal credit union'], domain: 'penfed.org', type: 'credit_union' },
    { id: 'schoolsfirst', displayName: 'SchoolsFirst FCU', aliases: ['schoolsfirst', 'schools first'], domain: 'schoolsfirstfcu.org', type: 'credit_union' },
    { id: 'statefarm', displayName: 'State Farm Bank', aliases: ['state farm', 'statefarm', 'state farm bank'], domain: 'statefarm.com', type: 'bank' },

    // Fintech / Neobanks
    { id: 'acorns', displayName: 'Acorns', aliases: ['acorns'], domain: 'acorns.com', type: 'brokerage' },
    { id: 'cashapp', displayName: 'Cash App', aliases: ['cash app', 'cashapp', 'square cash'], domain: 'cash.app', type: 'bank' },
    { id: 'current', displayName: 'Current', aliases: ['current', 'current bank'], domain: 'current.com', type: 'bank' },
    { id: 'dave', displayName: 'Dave', aliases: ['dave', 'dave banking'], domain: 'dave.com', type: 'bank' },
    { id: 'greenlight', displayName: 'Greenlight', aliases: ['greenlight'], domain: 'greenlight.com', type: 'bank' },
    { id: 'laurelroad', displayName: 'Laurel Road', aliases: ['laurel road', 'laurelroad'], domain: 'laurelroad.com', type: 'bank' },
    { id: 'lili', displayName: 'Lili', aliases: ['lili', 'lili bank'], domain: 'lili.co', type: 'bank' },
    { id: 'monzo', displayName: 'Monzo', aliases: ['monzo'], domain: 'monzo.com', type: 'bank' },
    { id: 'n26', displayName: 'N26', aliases: ['n26'], domain: 'n26.com', type: 'bank' },
    { id: 'one', displayName: 'ONE', aliases: ['one', 'one finance'], domain: 'one.app', type: 'bank' },
    { id: 'paypal', displayName: 'PayPal', aliases: ['paypal'], domain: 'paypal.com', type: 'bank' },
    { id: 'revolut', displayName: 'Revolut', aliases: ['revolut'], domain: 'revolut.com', type: 'bank' },
    { id: 'stash', displayName: 'Stash', aliases: ['stash', 'stash invest'], domain: 'stash.com', type: 'brokerage' },
    { id: 'stripe', displayName: 'Stripe', aliases: ['stripe'], domain: 'stripe.com', type: 'other' },
    { id: 'venmo', displayName: 'Venmo', aliases: ['venmo'], domain: 'venmo.com', type: 'bank' },
    { id: 'wise', displayName: 'Wise', aliases: ['wise', 'transferwise'], domain: 'wise.com', type: 'bank' },

    // Retirement / 401k Providers
    { id: 'aig', displayName: 'AIG', aliases: ['aig', 'aig retirement'], domain: 'aig.com', type: 'insurance' },
    { id: 'empower', displayName: 'Empower Retirement', aliases: ['empower retirement', 'empower'], domain: 'empower-retirement.com', type: 'brokerage' },
    { id: 'guideline', displayName: 'Guideline', aliases: ['guideline', 'guideline 401k'], domain: 'guideline.com', type: 'brokerage' },
    { id: 'human', displayName: 'Human Interest', aliases: ['human interest'], domain: 'humaninterest.com', type: 'brokerage' },
    { id: 'john-hancock', displayName: 'John Hancock', aliases: ['john hancock', 'johnhancock'], domain: 'johnhancock.com', type: 'insurance' },
    { id: 'lincoln', displayName: 'Lincoln Financial', aliases: ['lincoln', 'lincoln financial'], domain: 'lfg.com', type: 'insurance' },
    { id: 'principal', displayName: 'Principal', aliases: ['principal', 'principal financial'], domain: 'principal.com', type: 'brokerage' },
    { id: 'prudential', displayName: 'Prudential', aliases: ['prudential'], domain: 'prudential.com', type: 'insurance' },
    { id: 'tiaa', displayName: 'TIAA', aliases: ['tiaa', 'tiaa-cref'], domain: 'tiaa.org', type: 'brokerage' },
    { id: 'transamerica', displayName: 'Transamerica', aliases: ['transamerica'], domain: 'transamerica.com', type: 'insurance' },
];

/**
 * Lookup institution by name (fuzzy matching)
 */
export function findInstitution(name: string): Institution | undefined {
    const normalized = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    return INSTITUTIONS.find(inst => {
        // Exact match on display name
        if (inst.displayName.toLowerCase() === normalized) return true;
        // Match any alias
        return inst.aliases.some(alias => normalized.includes(alias) || alias.includes(normalized));
    });
}

/**
 * Get logo URL for an institution
 * Falls back to Google favicon service if no custom logo
 */
export function getInstitutionLogoUrl(institutionName: string, size: number = 64): string | null {
    const institution = findInstitution(institutionName);

    if (!institution) return null;

    // Use custom logo if available, otherwise Google favicon
    return institution.logoUrl || getFaviconUrl(institution.domain, size);
}

/**
 * Get institution display name (cleaned up)
 */
export function getInstitutionDisplayName(institutionName: string): string {
    const institution = findInstitution(institutionName);
    return institution?.displayName || institutionName;
}
