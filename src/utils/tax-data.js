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

// Sarcastic comments grouped by tax brackets with multiple variations
// Each bracket has 3-5 variations to avoid repetition
export const SARCASTIC_COMMENTS = [
    { 
        threshold: 0, 
        variations: [
            "Rp 0? Congratulations, you are legally poor. The government doesn't even want your money.",
            "Zero tax. You're either broke or a tax optimization genius. I'm betting on the first one.",
            "Nothing to pay? Enjoy this moment. It won't last long."
        ]
    },
    { 
        threshold: 50000, 
        variations: [
            "Wow, Rp 50k. You funded exactly one (1) brick for a sidewalk in Subang. Be proud.",
            "50k. That's like one fancy coffee at a government meeting. You're a hero.",
            "This amount could buy a government pen. A really nice one. Maybe."
        ]
    },
    { 
        threshold: 150000, 
        variations: [
            "With this tax, you bought a government official a nice lunch. Nasi Padang, extra rendang.",
            "150k. You're funding the snacks at a minor committee meeting. Your contribution is noted.",
            "This pays for exactly 3 reams of A4 paper at the tax office. Bureaucracy thanks you."
        ]
    },
    { 
        threshold: 300000, 
        variations: [
            "300k. That's almost enough to fix a pothole. Almost. Keep dreaming.",
            "Quarter million range. You're paying for the paint on a speed bump somewhere.",
            "This could buy a government employee's monthly phone credit. You're basically their telco provider."
        ]
    },
    { 
        threshold: 500000, 
        variations: [
            "Half a million. You're basically paying for the office stationery. Good job, photocopier hero.",
            "500k. That's a government intern's monthly allowance. You're employing the future!",
            "This amount funds exactly one minor office renovation. Like, changing a doorknob."
        ]
    },
    { 
        threshold: 1000000, 
        variations: [
            "1 Million. You're officially a 'contributor'. Too bad you don't get a plaque for this.",
            "Congrats on hitting 1M. You're now funding a government WhatsApp group admin.",
            "One million. That's a decent Indomie budget for a small government office. Respect.",
            "You're paying what a fresh grad makes. Except they get a salary. You get... a receipt."
        ]
    },
    { 
        threshold: 2000000, 
        variations: [
            "2 Million a month. You could have financed a solid NMAX with this money. Instead, you got... nothing.",
            "2M. You're basically leasing a motorcycle for the state. Does it come with insurance?",
            "This is a junior employee's salary. You're employing someone you'll never meet.",
            "Two million. That's enough for a government 'study tour' to Bali. You're not invited."
        ]
    },
    { 
        threshold: 3500000, 
        variations: [
            "3.5 Million. You are single-handedly funding a village head's meeting snacks. Thank you for your service.",
            "3.5M. You could buy a decent laptop every month. Instead, you're buying... democracy?",
            "This pays for a government team building event. Hope they have fun without you.",
            "You're funding a mid-level bureaucrat's coffee addiction. Premium beans, obviously."
        ]
    },
    { 
        threshold: 5000000, 
        variations: [
            "5 Million in tax? That's a UMR salary you're donating. You are employing a ghost worker.",
            "5M. You could lease a decent car. But no, you chose fiscal responsibility. Sucker.",
            "This is what a government supervisor makes. You're basically their shadow employer.",
            "Five million. That's a nice vacation fund. Too bad it's going to road construction you'll never see."
        ]
    },
    { 
        threshold: 7500000, 
        variations: [
            "7.5 Million. At this point, you should demand a reserved parking spot at the Tax Office.",
            "7.5M. You're paying for a government car's monthly fuel. Hope they drive carefully.",
            "This could fund a small government project. Like, painting a fence. A short fence.",
            "You're basically sponsoring a mid-level manager. Do you get naming rights?"
        ]
    },
    { 
        threshold: 10000000, 
        variations: [
            "10 Million. Digimons Digivolve, you just evolved into 'Cash Cow'. Moo.",
            "10M. You've entered the double-digit millions club. Your prize? More taxes next year.",
            "This is a government section head's salary. You're basically running a department now.",
            "Ten million. You could buy a used car every month. Or fund infrastructure. Tough choice."
        ]
    },
    { 
        threshold: 15000000, 
        variations: [
            "15 Million. You're paying a junior dev's salary to the state. Does that make you a tech lead?",
            "15M. You're funding a government 'consultant'. They consult on how to spend your money.",
            "This could buy a motorcycle every two weeks. But you chose patriotism. How noble.",
            "You're basically employing a small government team. Where's your org chart?"
        ]
    },
    { 
        threshold: 25000000, 
        variations: [
            "25 Million. You could buy a new iPhone every month. But you chose patriotism. Sure, let's call it that.",
            "25M. You're funding a government program you've never heard of. And never will.",
            "This is a senior manager's salary. You're basically C-suite adjacent now.",
            "Quarter of a hundred million. You could retire in Bali. But here we are."
        ]
    },
    { 
        threshold: 40000000, 
        variations: [
            "40 Million. Stop looking at the number. Just close your eyes and think of the toll roads you don't use.",
            "40M. You're paying for a government vehicle. A nice one. With AC that actually works.",
            "This could fund a small business. Instead, it's funding... well, we're not sure either.",
            "You're basically a government department's budget line item. Congrats on being data."
        ]
    },
    { 
        threshold: 60000000, 
        variations: [
            "60 Million. You are effectively the CEO of a small Kecamatan. Where is your sash?",
            "60M. You could buy a decent house. But you chose to fund... whatever this is.",
            "This is executive-level contribution. You should get a government email signature.",
            "You're paying what a director makes. Do you get to attend the meetings? No? Thought so."
        ]
    },
    { 
        threshold: 85000000, 
        variations: [
            "85 Million. Are you sure you're not laundering money? This looks like a rounding error for a cartel.",
            "85M. You're funding a small government building. Like, the bathroom. A nice bathroom.",
            "This could buy a luxury car. But you're building the nation. One tax receipt at a time.",
            "You're basically a government program. A well-funded one. With no benefits."
        ]
    },
    { 
        threshold: 120000000, 
        variations: [
            "120 Million. You paid for a luxury car, but you took the bus. The logic is flawless.",
            "120M. You're funding infrastructure you'll never use in places you'll never visit.",
            "This is C-suite salary territory. Except they get stock options. You get... this comment.",
            "You could buy a house every year. Instead, you're buying... national pride? Sure."
        ]
    },
    { 
        threshold: 200000000, 
        variations: [
            "200 Million. Welcome to the 1%. The government loves you. Your wallet hates you.",
            "200M. You're basically a government department. A whole department. Just you.",
            "This could fund a startup. A successful one. But here we are, funding... democracy.",
            "You're paying what a small company's revenue looks like. Except you're one person. Ouch."
        ]
    },
    { 
        threshold: 500000000, 
        variations: [
            "500 Million. Please adopt me.",
            "Half a billion. You're not paying taxes. You're funding a small town.",
            "This is 'I have an accountant' territory. Multiple accountants. And a lawyer.",
            "You could retire three generations of your family. But you chose to work. Interesting."
        ]
    },
    { 
        threshold: 1000000000, 
        variations: [
            "1 Billion. You are the economy. Just stop working, let's see what happens.",
            "A billion. At this point, the government should name a bridge after you.",
            "This is 'I'm in the Forbes list' money. Except it's going to the government. Not you.",
            "You're not a taxpayer. You're a national asset. Act accordingly."
        ]
    }
];
