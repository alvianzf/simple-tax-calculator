import { 
    TER_A, TER_B, TER_C, 
    STATUS_CATEGORY_MAP, 
    PTKP, 
    ARTICLE_17_RATES, 
    SARCASTIC_COMMENTS 
} from './tax-data.js';

// --- CORE: The "True Cost" Calculation (Annualized / 12) ---

export function calculateRealMonthlyTax(grossMonthly, status, bonus = 0) {
    // 1. Annualize
    const annualSalary = grossMonthly * 12;
    const annualGross = annualSalary + bonus;

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

// --- REVERSE: Tax -> Income ---
export function calculateGrossFromAnnualTax(targetTax, status) {
    // We already have 'calculateGrossFromAnnualTax' but need to add 'layers' support
    // Logic: Gross = (PKP + PTKP).
    // The layers are derivative of PKP.

    if (targetTax <= 0) {
        return {
            annualGross: 0, 
            monthlyGross: 0,
            pkp: 0,
            ptkp: PTKP[status] || PTKP['TK/0'],
            layers: [] // Added
        };
    }

    let remainingTax = targetTax;
    let calculatedPKP = 0;
    const layers = []; // To track reconstruction

    for (const tier of ARTICLE_17_RATES) {
        if (remainingTax <= 0) break;

        const previousLimit = ARTICLE_17_RATES[ARTICLE_17_RATES.indexOf(tier) - 1]?.limit || 0;
        const currentLimit = tier.limit === Infinity ? Infinity : tier.limit;
        const bracketSize = currentLimit - previousLimit;
        
        const maxTaxForBracket = bracketSize === Infinity ? Infinity : Math.floor(bracketSize * tier.rate);

        let taxInThisBracket = 0;
        let incomeInThisBracket = 0;

        if (remainingTax <= maxTaxForBracket) {
            // Fits in this bracket
            incomeInThisBracket = remainingTax / tier.rate;
            taxInThisBracket = remainingTax;
            
            remainingTax = 0;
        } else {
            // Fills this bracket
            incomeInThisBracket = bracketSize;
            taxInThisBracket = maxTaxForBracket;
            
            remainingTax -= maxTaxForBracket;
        }

        calculatedPKP += incomeInThisBracket;
        layers.push({
            rate: tier.rate,
            amount: Math.floor(incomeInThisBracket),
            tax: Math.floor(taxInThisBracket)
        });
    }

    const ptkp = PTKP[status] || PTKP['TK/0'];
    const annualGross = calculatedPKP + ptkp;
    const monthlyGross = Math.floor(annualGross / 12);

    return {
        annualGross: Math.floor(annualGross),
        monthlyGross: monthlyGross,
        pkp: Math.floor(calculatedPKP),
        ptkp: ptkp,
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
    if (taxMonthly <= 0) {
        const zeroVariations = SARCASTIC_COMMENTS[0].variations;
        return zeroVariations[Math.floor(Math.random() * zeroVariations.length)];
    }
    
    // Sort logic to be safe if array is unsorted
    const sortedComments = [...SARCASTIC_COMMENTS].sort((a, b) => a.threshold - b.threshold);
    
    // Find the highest threshold that is LESS THAN or EQUAL to the tax
    let selected = sortedComments[0];
    for (const c of sortedComments) {
        if (taxMonthly > c.threshold) { 
            selected = c;
        } else {
            break;
        }
    }
    
    // Randomly select one variation from the selected bracket
    const variations = selected.variations;
    const randomIndex = Math.floor(Math.random() * variations.length);
    
    return variations[randomIndex];
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}
