import { calculateMonthlyTax, calculateGrossUp } from './calculator.js';

console.log("Running Tax Calculator Tests...\n");

const tests = [
    // Case 1: TK/0, 10jt Income (Cat A)
    // 9.65jt - 11.05jt -> 3%
    {
        name: "TK/0, 10jt Gross",
        fn: () => calculateMonthlyTax(10000000, 'TK/0'),
        expect: { rate: 0.03, tax: 300000 }
    },
    // Case 2: K/1, 25jt Income (Cat B)
    // 24jt - 26.3jt -> 7%
    {
        name: "K/1, 25jt Gross",
        fn: () => calculateMonthlyTax(25000000, 'K/1'),
        expect: { rate: 0.07, tax: 1750000 }
    },
    // Case 3: K/3, 5jt Income (Cat C)
    // 0 - 6.6jt -> 0%
    {
        name: "K/3, 5jt Gross",
        fn: () => calculateMonthlyTax(5000000, 'K/3'),
        expect: { rate: 0.00, tax: 0 }
    },
    // Case 4: Gross Up Test
    // Target Net 9.7jt, TK/0
    // If Gross is 10jt, Tax is 300k, Net is 9.7jt.
    // So asking for 9.7jt Net should return ~10jt Gross.
    {
        name: "Net 9.7jt (TK/0) -> Gross Up",
        fn: () => calculateGrossUp(9700000, 'TK/0'),
        expect: { gross: 10000000, tax: 300000, rate: 0.03 }
    }
];

let passed = 0;
tests.forEach(t => {
    const result = t.fn();
    const isPass = result.rate === t.expect.rate && Math.abs(result.tax - t.expect.tax) < 1000;
    
    if (isPass) {
        console.log(`[PASS] ${t.name}`);
        passed++;
    } else {
        console.error(`[FAIL] ${t.name}`);
        console.error(`  Expected:`, t.expect);
        console.error(`  Got:     `, result);
    }
});

console.log(`\nPassed ${passed} / ${tests.length} tests.`);
