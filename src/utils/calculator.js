import { 
    TER_A, TER_B, TER_C, 
    STATUS_CATEGORY_MAP, 
    PTKP, 
    ARTICLE_17_RATES, 
    SARCASTIC_COMMENTS 
} from './tax-data.js';

// --- CORE: The "True Cost" Calculation (Annualized / 12) ---

export function calculateRealMonthlyTax(grossMonthly, status) {
    // 1. Annualize
    const annualGross = grossMonthly * 12;

    // 2. Determine PTKP
    const ptkpAmount = PTKP[status] || PTKP['TK/0'];

    // 3. Taxable Income (PKP)
    let pkp = annualGross - ptkpAmount;
    
    // Floor to thousands
    pkp = Math.floor(pkp / 1000) * 1000;

    if (pkp <= 0) {
        return { 
            taxAnnual: 0, 
            taxMonthly: 0, 
            pkp: 0, 
            ptkp: ptkpAmount,
            annualGross: annualGross,
            rateEffective: 0,
            layers: []
        };
    }

    // 4. Apply Progressive Rates (Pasal 17)
    let remainingPkp = pkp;
    let totalTax = 0;
    const layers = [];

    for (const tier of ARTICLE_17_RATES) {
        if (remainingPkp <= 0) break;
        
        const previousLimit = ARTICLE_17_RATES[ARTICLE_17_RATES.indexOf(tier) - 1]?.limit || 0;
        const currentLimit = tier.limit === Infinity ? Infinity : tier.limit;
        const currentBracketSize = currentLimit - previousLimit;
        
        const taxableInThisBracket = Math.min(remainingPkp, currentBracketSize);
        const taxForThisBracket = Math.floor(taxableInThisBracket * tier.rate);
        
        totalTax += taxForThisBracket;
        remainingPkp -= taxableInThisBracket;

        layers.push({
            rate: tier.rate,
            amount: taxableInThisBracket,
            tax: taxForThisBracket
        });
    }

    const taxMonthly = Math.floor(totalTax / 12);

    return {
        taxAnnual: totalTax,
        taxMonthly: taxMonthly,
        pkp: pkp,
        ptkp: ptkpAmount,
        annualGross: annualGross,
        rateEffective: totalTax / annualGross,
        layers: layers
    };
}

// --- LEGACY/COMPARISON: TER Method ---
export function calculateTER(grossIncome, status) {
    const category = STATUS_CATEGORY_MAP[status];
    let table;
    switch (category) {
        case 'A': table = TER_A; break;
        case 'B': table = TER_B; break;
        case 'C': table = TER_C; break;
        default: table = TER_A;
    }
    const tier = table.find(t => grossIncome <= t.max);
    const rate = tier ? tier.rate : 0;
    const tax = Math.floor(grossIncome * rate); 
    return { tax, rate };
}

// --- UTILS ---

export function getSarcasticComment(taxMonthly) {
    if (taxMonthly <= 0) return SARCASTIC_COMMENTS[0].text;
    const comment = SARCASTIC_COMMENTS.find(c => taxMonthly <= c.threshold) || SARCASTIC_COMMENTS[SARCASTIC_COMMENTS.length - 1];
    return comment.text;
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}
