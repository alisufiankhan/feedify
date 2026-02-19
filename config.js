const config = {
    meta: {
        title: "Feedify - Ramadan Charity",
        tagline: "Feeding Hope, Spreading Kindness.",
        ramadanStartDate: "2026-02-18" // Estimated start of Ramadan 2026
    },
    hero: {
        headline: "Help Us Host an Iftar for Orphans – Rs. 500 Per Meal",
        subheadline: "We have 15 days to raise Rs. 50,000. Already raised Rs. 1,000. Join us in spreading kindness this Ramadan.",
        target: 50000,
        raised: 1000,
        currencySymbol: "Rs.",
        deadline: "2026-03-06T23:59:59" // 15 days from Feb 17th
    },
    phases: [
        {
            id: "phase2",
            title: "Phase 2 – Orphans Iftar",
            goalDescription: "Orphanage Abbottabad - Iftar + Activities",
            goalAmount: 50000,
            raised: 1000,
            label: "Current Priority — Help Us Reach 50k in 15 Days",
            items: [
                { name: "1 Iftar Meal", cost: 500, icon: "🍲" },
                { name: "10 Orphans Meal", cost: 5000, icon: "👨‍👩‍👧‍👦" },
                { name: "Sponsor Half Event", cost: 25000, icon: "🤝" },
                { name: "Sponsor Full Event", cost: 50000, icon: "🎉" }
            ]
        },
        {
            id: "phase1",
            title: "Phase 1 – Rashan Distribution",
            goalDescription: "8 Full Rashan Packages (Rs. 12,500/family)",
            goalAmount: 100000,
            raised: 75000,
            label: "Ongoing — We are still accepting donations for Rashan",
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
            id: "phase3",
            title: "Phase 3 – Roadside Iftar Distribution",
            goalDescription: "Distributing Iftar boxes at Maghrib time",
            goalAmount: 50000,
            raised: 0,
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












