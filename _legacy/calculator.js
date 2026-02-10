import { 
    TER_A, TER_B, TER_C, 
    STATUS_CATEGORY_MAP, 
    PTKP, 
    ARTICLE_17_RATES, 
    SARCASTIC_COMMENTS 
} from './tax-data.js';

/**
 * Calculates Monthly PPh21 using TER 2024
 * @param {number} grossIncome - Monthly gross income
 * @param {string} status - PPh21 Status (e.g., 'TK/0')
 * @returns {object} { tax, rate }
 */
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
    const tax = Math.floor(grossIncome * rate); // Round down to integer usually

    return { tax, rate };
}

/**
 * Calculates Annual Tax using Article 17 Progressive Rates
 * @param {number} annualGross - Annual Gross Income
 * @param {string} status - PPh21 Status
 * @returns {object} { tax, taxableIncome }
 */
export function calculateAnnualTax(annualGross, status) {
    // 1. Calculate Biaya Jabatan (5% max 6jt/year or 500k/month)
    // Assumes simple case: calculate 5% of gross, capped at 6,000,000
    const biayaJabatan = Math.min(annualGross * 0.05, 6000000);
    
    // 2. Net Income
    const netIncome = annualGross - biayaJabatan;
    
    // 3. Taxable Income (PKP) - Round down to thousands
    const ptkp = PTKP[status] || PTKP['TK/0'];
    let pkp = netIncome - ptkp;
    pkp = Math.floor(pkp / 1000) * 1000; 

    if (pkp <= 0) return { tax: 0, taxableIncome: 0 };

    // 4. Apply Article 17 Rates
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

/**
 * Calculates Gross Up (Reverse Tax) for a desired Monthly Net
 * Uses an iterative approach to find the Gross that yields the target Net after TER.
 * We iterate because TER is a step function, not linear.
 * @param {number} targetNet - Desired Monthly Net
 * @param {string} status - PPh21 Status
 * @returns {object} { gross, tax, rate }
 */
export function calculateGrossUp(targetNet, status) {
    // Initial guess: Gross = Net
    let lowerBound = targetNet;
    let upperBound = targetNet * 2; // Safe upper bound
    let bestGross = targetNet;
    
    // Binary search-ish optimization or simple step?
    // TER is unique because it's step-based. 
    // We can just check the TER tiers to find which one allows this Net.
    
    // Better approach for TER:
    // Net = Gross - (Gross * Rate) = Gross * (1 - Rate)
    // Gross = Net / (1 - Rate)
    // We can check this for each tier's Rate.
    
    const category = STATUS_CATEGORY_MAP[status];
    let table;
    switch (category) {
        case 'A': table = TER_A; break;
        case 'B': table = TER_B; break;
        case 'C': table = TER_C; break;
        default: table = TER_A;
    }

    for (const tier of table) {
        // Calculate potential gross for this tier's rate
        const rate = tier.rate;
        const potentialGross = targetNet / (1 - rate);
        
        // previous tier max (to ensure we are in the correct bracket)
        const prevMax = table[table.indexOf(tier) - 1]?.max || 0;
        
        // If this potential Gross falls within this tier's range (prevMax < Gross <= max)
        if (potentialGross > prevMax && potentialGross <= tier.max) {
             return { 
                 gross: Math.ceil(potentialGross), 
                 tax: Math.ceil(potentialGross * rate), 
                 rate 
             };
        }
    }
    
    // If we exceed the highest defined bracket (which is unlikely given Infinity), fallback
    // For the last bucket (Infinity), max is Infinity.
    const lastTier = table[table.length - 1];
    const potentialGross = targetNet / (1 - lastTier.rate);
    return {
        gross: Math.ceil(potentialGross),
        tax: Math.ceil(potentialGross * lastTier.rate),
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
