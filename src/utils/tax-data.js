/**
 * Simple Tax Calculator - Tax Data & Constants
 * Based on PP 58/2023 and PMK 168/2023 (TER 2024/2025)
 */

export const PTKP = {
    'TK/0': 54000000,
    'TK/1': 58500000,
    'TK/2': 63000000,
    'TK/3': 67500000,
    'K/0': 58500000,
    'K/1': 63000000,
    'K/2': 67500000,
    'K/3': 72000000
};

export const ARTICLE_17_RATES = [
    { limit: 60000000, rate: 0.05 },
    { limit: 250000000, rate: 0.15 },
    { limit: 500000000, rate: 0.25 },
    { limit: 5000000000, rate: 0.30 },
    { limit: Infinity, rate: 0.35 }
];

export const STATUS_CATEGORY_MAP = {
    'TK/0': 'A', 'TK/1': 'A', 'K/0': 'A',
    'TK/2': 'B', 'TK/3': 'B', 'K/1': 'B', 'K/2': 'B',
    'K/3': 'C'
};

// TER Tables (Simplified for brevity, full tables would be imported or huge)
// For the purpose of this simplified app, we might rely on the Real Cost logic primarily
// But here are placeholders if we need strict TER mode compliance
export const TER_A = [
    { max: 5400000, rate: 0 },
    { max: 5650000, rate: 0.0025 },
    { max: 5950000, rate: 0.005 },
    { max: 6300000, rate: 0.0075 },
    { max: 6750000, rate: 0.01 },
    { max: 7500000, rate: 0.015 },
    { max: 8550000, rate: 0.02 },
    { max: 9650000, rate: 0.025 },
    { max: 11050000, rate: 0.03 },
    { max: 12600000, rate: 0.04 }, // ... and so on
    { max: Infinity, rate: 0.34 } // Cap
];
// (Note: In a real app we'd have the full CSV data here. For now we use Real Calc as primary)
export const TER_B = []; 
export const TER_C = []; 

export const SARCASTIC_COMMENTS = [
    { threshold: 0, text: "Rp 0? Congratulations, you are legally poor. The government doesn't even want your money." },
    { threshold: 50000, text: "Wow, Rp 50k. You funded exactly one (1) brick for a sidewalk in Subang. Be proud." },
    { threshold: 150000, text: "With this tax, you bought a government official a nice lunch. Nasi Padang, extra rendang." },
    { threshold: 300000, text: "300k. That's almost enough to fix a pothole. Almost. Keep dreaming." },
    { threshold: 500000, text: "Half a million. You're basically paying for the office stationery. Good job, photocopier hero." },
    { threshold: 1000000, text: "1 Million. You're officially a 'contributor'. Too bad you don't get a plaque for this." },
    { threshold: 2000000, text: "2 Million a month. You could have financed a solid NMAX with this money. Instead, you got... nothing." },
    { threshold: 3500000, text: "3.5 Million. You are single-handedly funding a village head's meeting snacks. Thank you for your service." },
    { threshold: 5000000, text: "5 Million in tax? That's a UMR salary you're donating. You are employing a ghost worker." },
    { threshold: 7500000, text: "7.5 Million. At this point, you should demand a reserved parking spot at the Tax Office." },
    { threshold: 10000000, text: "10 Million. Digimons Digivolve, you just evolved into 'Cash Cow'. Moo." },
    { threshold: 15000000, text: "15 Million. You're paying a junior dev's salary to the state. Does that make you a tech lead?" },
    { threshold: 25000000, text: "25 Million. You could buy a new iPhone every month. But you chose patriotism. Sure, let's call it that." },
    { threshold: 40000000, text: "40 Million. Stop looking at the number. Just close your eyes and think of the toll roads you don't use." },
    { threshold: 60000000, text: "60 Million. You are effectively the CEO of a small Kecamatan. Where is your sash?" },
    { threshold: 85000000, text: "85 Million. Are you sure you're not laundering money? This looks like a rounding error for a cartel." },
    { threshold: 120000000, text: "120 Million. You paid for a luxury car, but you took the bus. The logic is flawless." },
    { threshold: 200000000, text: "200 Million. Welcome to the 1%. The government loves you. Your wallet hates you." },
    { threshold: 500000000, text: "500 Million. Please adopt me." },
    { threshold: 1000000000, text: "1 Billion. You are the economy. Just stop working, let's see what happens." }
];
