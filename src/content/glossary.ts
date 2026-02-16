export interface GlossaryTerm {
    term: string;
    definition: string;
    phonetic?: string;
    scholarly_note?: string;
}

export const GLOSSARY: Record<string, GlossaryTerm> = {
    nisab: {
        term: "Nisab",
        definition: "The minimum amount of wealth a Muslim must possess before becoming liable for Zakat. If your net zakatable assets are below this threshold, you do not pay Zakat.",
        phonetic: "/ni-saab/",
        scholarly_note: "Historically defined as 85g of gold (approx $6k) or 595g of silver (approx $400). ZakatFlow supports both, but recommends Silver to be safer for the beneficiary."
    },
    hawl: {
        term: "Hawl",
        definition: "The lunar year (approx. 354 days) that must pass while you possess wealth above the Nisab threshold before Zakat becomes due.",
        phonetic: "/ḥawl/",
        scholarly_note: "If wealth dips below Nisab during the year, the Hawl resets (Hanafi view). Others require Nisab only at the beginning and end."
    },
    mal_dimar: {
        term: "Māl Ḍimār",
        definition: "Wealth that you own but cannot access or use (e.g., lost property, or strict interpretations of 401k/retirement funds before age 59.5).",
        phonetic: "/maal dhi-maar/",
        scholarly_note: "Used by some scholars to argue that retirement accounts are not zakatable until the funds are actually accessible."
    },
    zakat_al_mal: {
        term: "Zakat al-Mal",
        definition: "The obligatory annual payment of 2.5% on surplus wealth.",
        phonetic: "/za-kaat al-maal/",
        scholarly_note: "distinct from Zakat al-Fitr, which is paid per person at the end of Ramadan."
    },
    rikaz: {
        term: "Rikaz",
        definition: "Buried treasure or easily extracted natural resources, taxed at a higher rate (20%) upon discovery.",
        phonetic: "/ri-kaaz/",
        scholarly_note: "Rarely applicable in modern personal finance, but conceptually linked to some views on oil/mineral dividends."
    }
};
