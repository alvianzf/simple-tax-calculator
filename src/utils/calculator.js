import { 
    TER_A, TER_B, TER_C, 
    STATUS_CATEGORY_MAP, 
    PTKP, 
    ARTICLE_17_RATES, 
    SARCASTIC_COMMENTS 
} from './tax-data.js';

export function calculateMonthlyTax(grossIncome, status) {
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

export function calculateAnnualTax(annualGross, status) {
    const biayaJabatan = Math.min(annualGross * 0.05, 6000000);
    const netIncome = annualGross - biayaJabatan;
    const ptkp = PTKP[status] || PTKP['TK/0'];
    let pkp = netIncome - ptkp;
    pkp = Math.floor(pkp / 1000) * 1000; 

    if (pkp <= 0) return { tax: 0, taxableIncome: 0 };

    let remainingPkp = pkp;
    let totalTax = 0;

    for (const tier of ARTICLE_17_RATES) {
        if (remainingPkp <= 0) break;
        const previousLimit = ARTICLE_17_RATES[ARTICLE_17_RATES.indexOf(tier) - 1]?.limit || 0;
        const currentBracketSize = tier.limit - previousLimit;
        const taxableInThisBracket = Math.min(remainingPkp, currentBracketSize);
        totalTax += taxableInThisBracket * tier.rate;
        remainingPkp -= taxableInThisBracket;
    }

    return { tax: Math.floor(totalTax), taxableIncome: pkp };
}

// Net to Gross
export function calculateGrossUp(targetNet, status) {
    const category = STATUS_CATEGORY_MAP[status];
    let table;
    switch (category) {
        case 'A': table = TER_A; break;
        case 'B': table = TER_B; break;
        case 'C': table = TER_C; break;
        default: table = TER_A;
    }

    for (const tier of table) {
        const rate = tier.rate;
        const potentialGross = targetNet / (1 - rate);
        const prevMax = table[table.indexOf(tier) - 1]?.max || 0;
        
        if (potentialGross > prevMax && potentialGross <= tier.max) {
             return { 
                 gross: Math.ceil(potentialGross), 
                 tax: Math.ceil(potentialGross * rate), 
                 rate 
             };
        }
    }
    
    const lastTier = table[table.length - 1];
    const potentialGross = targetNet / (1 - lastTier.rate);
    return {
        gross: Math.ceil(potentialGross),
        tax: Math.ceil(potentialGross * lastTier.rate),
        rate: lastTier.rate
    };
}

// Tax to Gross (New Feature)
export function calculateIncomeFromTax(targetTax, status) {
    // We need to find a Gross where Gross * Rate = TargetTax
    // Tax = Gross * Rate  => Gross = Tax / Rate
    // But Rate depends on Gross.
    // So we iterate brackets to see if (Tax / Rate) falls within that bracket.

    if (targetTax <= 0) return { gross: 0, rate: 0 };

    const category = STATUS_CATEGORY_MAP[status];
    let table;
    switch (category) {
        case 'A': table = TER_A; break;
        case 'B': table = TER_B; break;
        case 'C': table = TER_C; break;
        default: table = TER_A;
    }

    for (const tier of table) {
        const rate = tier.rate;
        if (rate === 0) continue; // Cannot divide by zero

        const potentialGross = targetTax / rate;
        const prevMax = table[table.indexOf(tier) - 1]?.max || 0;

        // Check if this potential gross actually belongs to this tier
        if (potentialGross > prevMax && potentialGross <= tier.max) {
            return {
                gross: Math.floor(potentialGross),
                tax: targetTax,
                rate: rate
            };
        }
    }

    // Fallback for highest bracket
    const lastTier = table[table.length - 1];
    const potentialGross = targetTax / lastTier.rate;
    return {
        gross: Math.floor(potentialGross),
        tax: targetTax,
        rate: lastTier.rate
    };
}

export function getSarcasticComment(taxAmount) {
    const comment = SARCASTIC_COMMENTS.find(c => taxAmount <= c.threshold) || SARCASTIC_COMMENTS[SARCASTIC_COMMENTS.length - 1];
    return comment.text;
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}
