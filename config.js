const config = {
    meta: {
        title: "Feedify - Ramadan Charity",
        tagline: "Feeding Hope, Spreading Mercy.",
        ramadanStartDate: "2026-02-18" // Estimated start of Ramadan 2026
    },
    hero: {
        headline: "This Ramadan, Let’s Feed 8 Families in 1 Day",
        subheadline: "We have already raised Rs. 64,000 out of Rs. 100,000 for our Rashan Drive. Help us complete the remaining target and deliver food within 24 hours.",
        target: 100000,
        raised: 64000,
        currencySymbol: "Rs.",
        deadline: "2026-02-16T23:59:59" // 2 days from Feb 14th
    },
    phases: [
        {
            id: "phase1",
            title: "Phase 1 – Rashan Distribution (Priority)",
            goalDescription: "8 Full Rashan Packages (Rs. 12,500/family)",
            goalAmount: 100000,
            items: [
                { name: "Flour (10kg)", cost: 1650, icon: "🌾" },
                { name: "Cooking Oil (5 packs)", cost: 2950, icon: "🍶" },
                { name: "Rice (5kg)", cost: 1750, icon: "🍚" },
                { name: "Dates (1kg)", cost: 800, icon: "🌴" },
                { name: "Chicken (1 whole)", cost: 1500, icon: "🍗" },
                { name: "Jam-e-Shirin", cost: 520, icon: "🍷" },
                { name: "Besan (1kg)", cost: 350, icon: "🥣" },
                { name: "Full Rashan Package", cost: 12500, icon: "📦" }
            ]
        },
        {
            id: "phase2",
            title: "Phase 2 – Orphans Iftar (Upcoming)",
            goalDescription: "Orphanage Abbottabad - Iftar + Activities",
            goalAmount: 50000,
            label: "Next Phase — Help Us Reach Here After Rashan Completion",
            items: [
                { name: "1 Iftar Meal", cost: 500, icon: "🍲" },
                { name: "10 Orphans Meal", cost: 5000, icon: "👨‍👩‍👧‍👦" },
                { name: "Sponsor Half Event", cost: 25000, icon: "🤝" },
                { name: "Sponsor Full Event", cost: 50000, icon: "🎉" }
            ]
        },
        {
            id: "phase3",
            title: "Phase 3 – Roadside Iftar Distribution",
            goalDescription: "Distributing Iftar boxes at Maghrib time",
            quote: "“Whoever provides the food for a fasting person to break his fast with, then for him is the same reward as his (the fasting person's), without anything being diminished from the reward of the fasting person.” (Jami' at-Tirmidhi 807)",
            items: [
                { name: "1 Iftar Box", cost: 300, icon: "🍱" },
                { name: "10 Boxes", cost: 3000, icon: "📦" },
                { name: "50 Boxes", cost: 15000, icon: "🚛" }
            ]
        }
    ],
    socialProof: {
        stat1: "57,500 Already Raised",
        stat2: "1000+ Boxes Distributed in previous 2 Ramadans",
        stat3: "Community Powered Initiative",
        testimonial: "Ramadan is about feeling for others."
    },
    transparency: {
        text: "Full documentation will be shared. Photos & videos of distribution, clear spending breakdown, and direct bank transfer details."
    },
    bankDetails: {
        bankName: "Allied Bank Limited",
        accountHolder: "Abdullah Khan",
        accountNumber: "00050010075849730013",
        iban: "PK94ABPA0010075849730013",
        mobilePayment: "03485700850 (EasyPaisa / JazzCash)"
    }
};

if (typeof module !== 'undefined') module.exports = config;





