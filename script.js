document.addEventListener('DOMContentLoaded', () => {
    if (typeof config === 'undefined') {
        console.error("Config file not found!");
        return;
    }

    /* ------------------------------------------------------------- 
       HERO SECTION 
    ------------------------------------------------------------- */
    document.getElementById('hero-headline').textContent = config.hero.headline;
    document.getElementById('hero-subheadline').textContent = config.hero.subheadline;

    const target = config.hero.target;
    const raised = config.hero.raised;
    const percentage = Math.min((raised / target) * 100, 100);
    const remaining = target - raised;
    const currency = config.hero.currencySymbol;
    const formatCurrency = (amount) => currency + " " + amount.toLocaleString();

    document.getElementById('progress-fill').style.width = percentage + "%";
    document.getElementById('raised-amount').textContent = `${formatCurrency(raised)} raised`;
    document.getElementById('target-amount').textContent = `of ${formatCurrency(target)}`;
    document.getElementById('remaining-amount').textContent = `${formatCurrency(remaining)} Remaining`;

    /* ------------------------------------------------------------- 
       COUNTDOWN LOGIC 
    ------------------------------------------------------------- */
    const deadline = new Date(config.hero.deadline).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = deadline - now;

        if (distance < 0) {
            document.getElementById('countdown').innerHTML = "<div><span>ENDED</span></div>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ------------------------------------------------------------- 
       PHASES GENERATION 
    ------------------------------------------------------------- */
    const phasesContainer = document.getElementById('phases-container');

    config.phases.forEach(phase => {
        const section = document.createElement('section');
        section.className = 'phase-section';
        if (phase.id) section.id = phase.id;

        let headerHTML = `
            <div class="phase-header">
                <h2 class="phase-title">${phase.title}</h2>
                <p class="phase-goal">${phase.goalDescription}</p>
        `;

        if (phase.label) {
            headerHTML += `<p style="margin-top:0.5rem; color: #666; font-style: italic;">${phase.label}</p>`;
        }

        if (phase.quote) {
            headerHTML += `<blockquote class="phase-quote">${phase.quote}</blockquote>`;
        }

        headerHTML += `</div>`;

        let itemsHTML = `<div class="items-grid">`;
        phase.items.forEach(item => {
            // Clicking item opens modal with this phase pre-selected
            itemsHTML += `
                <div class="donation-card" onclick="openDonateModal('${phase.id}')">
                    <span class="item-icon">${item.icon}</span>
                    <span class="item-name">${item.name}</span>
                    <span class="item-cost">${formatCurrency(item.cost)}</span>
                </div>
            `;
        });
        itemsHTML += `</div>`;

        section.innerHTML = headerHTML + itemsHTML;
        phasesContainer.appendChild(section);
    });

    /* ------------------------------------------------------------- 
       SOCIAL & TRANSPARENCY 
    ------------------------------------------------------------- */
    const socialGrid = document.getElementById('social-proof-grid');
    socialGrid.innerHTML = `
        <div class="stat-item">${config.socialProof.stat1}</div>
        <div class="stat-item">${config.socialProof.stat2}</div>
        <div class="stat-item">${config.socialProof.stat3}</div>
    `;

    document.getElementById('testimonial-placeholder').textContent = `"${config.socialProof.testimonial}"`;
    document.getElementById('transparency-text').textContent = config.transparency.text;

    /* ------------------------------------------------------------- 
       BANK DETAILS & RAMADAN GREETING 
    ------------------------------------------------------------- */
    // Populate Bank Details
    if (config.bankDetails) {
        document.getElementById('bank-name').textContent = config.bankDetails.bankName;
        document.getElementById('bank-holder').textContent = config.bankDetails.accountHolder;
        document.getElementById('bank-number').textContent = config.bankDetails.accountNumber;
        document.getElementById('bank-iban').textContent = config.bankDetails.iban;
        document.getElementById('bank-mobile').textContent = config.bankDetails.mobilePayment;

        // Modal Bank Details
        document.getElementById('modal-bank-name').textContent = config.bankDetails.bankName;
        document.getElementById('modal-bank-holder').textContent = config.bankDetails.accountHolder;
        document.getElementById('modal-bank-number').textContent = config.bankDetails.accountNumber;
        document.getElementById('modal-bank-mobile').textContent = config.bankDetails.mobilePayment;

        // WhatsApp Link (clean logic)
        const waNumber = config.bankDetails.mobilePayment.split(' ')[0].replace(/^0/, '92');
        const waLink = `https://wa.me/${waNumber}?text=Assalam-o-Alaikum, I want to share receipt for donation.`;
        document.getElementById('whatsapp-link').href = waLink;

        // Floating Widget Link
        const floatBtn = document.getElementById('floating-whatsapp');
        if (floatBtn) {
            floatBtn.href = `https://wa.me/${waNumber}?text=Assalam-o-Alaikum, I have a question regarding Feedify.`;
        }
    }

    if (config.meta && config.meta.ramadanStartDate) {
        const today = new Date();
        const ramadanStart = new Date(config.meta.ramadanStartDate);
        today.setHours(0, 0, 0, 0);
        ramadanStart.setHours(0, 0, 0, 0);
        if (today >= ramadanStart) {
            const tagline = document.querySelector('.tagline');
            if (tagline) {
                tagline.textContent = "Ramadan Mubarak! " + config.meta.tagline;
                tagline.style.color = "var(--secondary-color)";
                tagline.style.fontWeight = "bold";
            }
        }
    }
});

/* ------------------------------------------------------------- 
   DONATION MODAL LOGIC 
------------------------------------------------------------- */
let currentDonation = {
    amount: 0,
    items: [],
    phaseId: null
};

window.scrollToDonate = function () {
    openDonateModal();
}

window.openDonateModal = function (preselectedPhaseId = null) {
    const modal = document.getElementById('donate-modal');
    modal.style.display = 'flex';

    // Reset state
    currentDonation = { amount: 0, items: [], phaseId: null };
    showStep(1);

    // Render Phase Selection
    const container = document.getElementById('phase-select-container');
    container.innerHTML = '';

    config.phases.forEach(phase => {
        const div = document.createElement('div');
        div.className = 'phase-btn';
        if (preselectedPhaseId === phase.id) div.classList.add('selected');

        div.innerHTML = `<h3>${phase.title}</h3><small>${phase.goalDescription}</small>`;
        div.onclick = () => selectPhase(phase);
        container.appendChild(div);
    });

    // Auto-select if clicked from card
    if (preselectedPhaseId) {
        const phase = config.phases.find(p => p.id === preselectedPhaseId);
        if (phase) selectPhase(phase);
    }
};

window.closeDonateModal = function () {
    document.getElementById('donate-modal').style.display = 'none';
};

window.selectPhase = function (phase) {
    currentDonation.phaseId = phase.id;

    // Render Items for Step 2
    const container = document.getElementById('items-checklist-container');
    container.innerHTML = '';

    phase.items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'checklist-item';
        div.innerHTML = `
            <label class="checklist-label">
                <input type="checkbox" class="checklist-checkbox" 
                       onchange="toggleItem('${item.name}', ${item.cost}, this.checked)"
                       value="${index}">
                <span>${item.icon} ${item.name}</span>
            </label>
            <span style="font-weight:600;">Rs. ${item.cost.toLocaleString()}</span>
        `;
        container.appendChild(div);
    });

    updateTotalDisplay();
    showStep(2);
};

window.toggleItem = function (name, cost, isChecked) {
    if (isChecked) {
        currentDonation.amount += cost;
        currentDonation.items.push(name);
    } else {
        currentDonation.amount -= cost;
        currentDonation.items = currentDonation.items.filter(i => i !== name);
    }
    updateTotalDisplay();
};

window.updateTotalDisplay = function () {
    const el = document.getElementById('donation-total');
    el.textContent = "Rs. " + currentDonation.amount.toLocaleString();

    const finalEl = document.getElementById('final-total');
    finalEl.textContent = "Rs. " + currentDonation.amount.toLocaleString();
};

window.showStep = function (stepNum) {
    document.querySelectorAll('.modal-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step-${stepNum}`).classList.add('active');
};

window.nextStep = function (stepNum) {
    if (stepNum === 3 && currentDonation.amount === 0) {
        alert("Please select at least one item to donate.");
        return;
    }
    showStep(stepNum);
};

window.prevStep = function (stepNum) {
    showStep(stepNum);
};

// Close modal on outside click
window.onclick = function (event) {
    const modal = document.getElementById('donate-modal');
    if (event.target === modal) {
        closeDonateModal();
    }
};

/* ------------------------------------------------------------- 
   COPY TO CLIPBOARD UTILS 
------------------------------------------------------------- */
window.copyText = function (elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast("Copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

window.copyAllBankDetails = function () {
    if (typeof config === 'undefined' || !config.bankDetails) return;

    const details = `
Bank Name: ${config.bankDetails.bankName}
Account Holder: ${config.bankDetails.accountHolder}
Account Number: ${config.bankDetails.accountNumber}
IBAN: ${config.bankDetails.iban}
EasyPaisa / JazzCash: ${config.bankDetails.mobilePayment}
    `.trim();

    navigator.clipboard.writeText(details).then(() => {
        showToast("All bank details copied!");
    });
};

function showToast(message) {
    const div = document.createElement('div');
    div.className = 'copy-feedback';
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}
