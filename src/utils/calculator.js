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
    // 1. We know: Tax = (PKP * Rate) - Layer_Adjustments
    // But since it's progressive, we need to find which bracket we end up in.
    // Iterative approach is safest and easiest to maintain given the layers.

    // Cap iterations to prevent infinite loops in edge cases
    let low = PTKP[status] || 54000000; // Gross must be at least PTKP to have tax
    let high = low + (targetTax * 20); // Base estimate (assuming 5% rate)
    
    // Adjust high if tax is large (higher brackets)
    if (targetTax > 60000000 * 0.05) high = low + (targetTax * 10); // Closer to 15% etc
    if (targetTax > 500000000) high = low + (targetTax * 5); // Closer to 25-30%

    let bestGross = low;
    
    // Binary search for Gross that yields this Tax
    for (let i = 0; i < 100; i++) {
        const mid = Math.floor((low + high) / 2);
        const result = calculateRealMonthlyTax(Math.floor(mid / 12), status);
        
        const calculatedTax = result.taxAnnual;

        if (Math.abs(calculatedTax - targetTax) < 1000) {
            bestGross = result.annualGross;
            break;
        }

        if (calculatedTax < targetTax) {
            low = mid + 1000;
        } else {
            high = mid - 1000;
        }
        bestGross = mid;
    }

    // Recalculate full details for the best match
    const finalResult = calculateRealMonthlyTax(Math.floor(bestGross / 12), status);
    
    return {
        annualGross: finalResult.annualGross,
        monthlyGross: Math.floor(finalResult.annualGross / 12),
        pkp: finalResult.pkp,
        ptkp: finalResult.ptkp,
        layers: finalResult.layers,
        taxAnnual: finalResult.taxAnnual,
        taxMonthly: finalResult.taxMonthly
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

// --- REVERSE: Net Income -> Gross Income (Real Tax Burden) ---
export function calculateGrossFromNet(netMonthly, status) {
    // Target: We want (Gross - Tax(Gross)) = Net
    // Tax is calculated using calculateRealMonthlyTax (Annualized -> PTKP -> Progressive -> Divide 12)
    // We will use binary search to find the Gross.

    let low = netMonthly; 
    let high = netMonthly * 2; // Upper bound assumption
    let bestGross = netMonthly;
    
    // refine upper bound if needed
    while (true) {
        const res = calculateRealMonthlyTax(high, status);
        const net = high - res.taxMonthly;
        if (net > netMonthly) break;
        high *= 2;
        if (high > 10000000000) break; // Safety break 10M
    }

    for (let i = 0; i < 50; i++) {
        const mid = Math.floor((low + high) / 2);
        const result = calculateRealMonthlyTax(mid, status);
        const calculatedNet = mid - result.taxMonthly;

        if (Math.abs(calculatedNet - netMonthly) < 1000) {
            bestGross = mid;
            break;
        }

        if (calculatedNet < netMonthly) {
            low = mid + 1000;
        } else {
            high = mid - 1000;
        }
        bestGross = mid;
    }

    const finalResult = calculateRealMonthlyTax(bestGross, status);

    return {
        grossMonthly: bestGross,
        annualGross: finalResult.annualGross,
        taxMonthly: finalResult.taxMonthly,
        taxAnnual: finalResult.taxAnnual,
        netMonthly: bestGross - finalResult.taxMonthly,
        pkp: finalResult.pkp,
        ptkp: finalResult.ptkp,
        layers: finalResult.layers,
        rateEffective: finalResult.rateEffective
    };
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
