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

    document.getElementById('remaining-amount').textContent = `${formatCurrency(remaining)} Remaining`;

    /* Hero Badge Logic simplified - Phase 1 is now in announcement bar */
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

        let dynamicSubheadline = config.hero.subheadline.replace('{days}', Math.max(0, days));
        document.getElementById('hero-subheadline').textContent = dynamicSubheadline;

        config.phases.forEach(phase => {
            if (phase.label && phase.label.includes('{days}')) {
                let el = document.getElementById(`phase-label-${phase.id}`);
                if (el) {
                    el.textContent = phase.label.replace('{days}', Math.max(0, days));
                }
            }
        });
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ------------------------------------------------------------- 
       PHASES GENERATION 
    ------------------------------------------------------------- */
    const phasesContainer = document.getElementById('phases-container');

    config.phases.forEach(phase => {
        const section = document.createElement('section');
        section.className = 'phase-section fade-in';
        if (phase.id) section.id = phase.id;

        let headerHTML = `
            <div class="phase-header">
                <h2 class="phase-title">${phase.title}</h2>
                <p class="phase-goal">${phase.goalDescription}</p>
        `;

        // Inject Progress Bar if raised & goalAmount exist (except for Phase 1 which is concluded)
        if (phase.id !== 'phase1' && phase.raised !== undefined && phase.goalAmount) {
            const percentage = Math.min((phase.raised / phase.goalAmount) * 100, 100);
            const remaining = phase.goalAmount - phase.raised;

            headerHTML += `
                <div class="progress-container" style="margin: 1.5rem auto; max-width: 600px; padding: 1rem;">
                    <div class="progress-bar-bg" style="background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1);">
                        <div class="progress-bar-fill" style="width: ${percentage}%; background-color: var(--primary-color);"></div>
                    </div>
                    <div class="progress-stats" style="font-size: 0.9rem; color: #555;">
                        <span>Rs. ${phase.raised.toLocaleString()} raised</span>
                        <span>of Rs. ${phase.goalAmount.toLocaleString()}</span>
                    </div>
                    <div class="remaining" style="font-size: 0.85rem; margin-top: 0.2rem; color: var(--accent-color);">
                        Rs. ${remaining.toLocaleString()} Remaining
                    </div>
                </div>
            `;
        }


        if (phase.label) {
            let labelText = phase.label;
            if (labelText.includes('{days}')) {
                const distance = deadline - new Date().getTime();
                const initDays = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
                labelText = labelText.replace('{days}', initDays);
            }
            headerHTML += `<p id="phase-label-${phase.id}" style="margin-top:0.5rem; color: #666; font-style: italic;">${labelText}</p>`;
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

        let galleryHTML = '';
        if (phase.gallery && phase.gallery.length > 0) {
            galleryHTML = `<div class="phase-gallery">`;
            phase.gallery.forEach(media => {
                if (media.type === 'video') {
                    galleryHTML += `
                        <div class="gallery-item video-item">
                            <video controls poster="${media.poster}">
                                <source src="${media.url}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    `;
                } else if (media.type === 'image') {
                    galleryHTML += `
                        <div class="gallery-item image-item">
                            <img src="${media.url}" alt="Phase Visual" loading="lazy">
                        </div>
                    `;
                } else if (media.type === 'embed') {
                    galleryHTML += `
                        <div class="gallery-item embed-item" style="display:flex; justify-content:center; width:100%;">
                            ${media.html}
                        </div>
                    `;
                }
            });
            galleryHTML += `</div>`;
        }

        section.innerHTML = headerHTML + galleryHTML + itemsHTML;
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

    /* ------------------------------------------------------------- 
       RECENT DONATIONS TICKER
    ------------------------------------------------------------- */
    const tickerContainer = document.getElementById('donation-ticker');
    if (config.recentDonations && config.recentDonations.length > 0) {
        let itemsHTML = '';
        config.recentDonations.forEach(donation => {
            itemsHTML += `<div class="ticker__item"><strong>&bull;</strong> ${donation.text}</div>`;
        });
        // Duplicate the list dynamically to ensure it's wide enough for max-content scroll
        tickerContainer.innerHTML = `
            <div class="ticker__content">${itemsHTML}</div>
            <div class="ticker__content">${itemsHTML}</div>
            <div class="ticker__content">${itemsHTML}</div>
            <div class="ticker__content">${itemsHTML}</div>
        `;
    }

    /* ------------------------------------------------------------- 
       SCROLL ANIMATIONS (IntersectionObserver)
    ------------------------------------------------------------- */
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    /* Ramadan start logic removed as we now have a fixed Ramadan Mubarak heading */
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

    // Trigger confetti animation when proceeding to payment
    if (stepNum === 3 && typeof confetti !== 'undefined') {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }

    showStep(stepNum);
};

window.processPayment = function (btn) {
    btn.textContent = "Processing...";
    btn.disabled = true;

    // Simulate network delay for effect
    setTimeout(() => {
        btn.textContent = "Proceed to Pay (Mock)";
        btn.disabled = false;

        // Trigger confetti
        if (typeof confetti !== 'undefined') {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }

        // Setup WhatsApp link for final step
        const waNumber = config.bankDetails.mobilePayment.split(' ')[0].replace(/^0/, '92');
        const waLink = `https://wa.me/${waNumber}?text=Assalam-o-Alaikum, I have donated Rs. ${currentDonation.amount.toLocaleString()} for the following items: ${currentDonation.items.join(', ')}. Here is my receipt.`;
        document.getElementById('whatsapp-link-final').href = waLink;

        // Move to Step 4 and initialize scratch card
        showStep(4);
        initScratchCard();
    }, 800);
};

window.prevStep = function (stepNum) {
    showStep(stepNum);
};

// Scratch Card Logic
function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = document.getElementById('scratch-container');

    // Set canvas resolution to container size
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Fill canvas with silver "foil"
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text over foil
    ctx.font = "bold 22px Inter, sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch Here!", canvas.width / 2, canvas.height / 2);

    let isDrawing = false;

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        // Handle touch and mouse events
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function scratch(e) {
        if (!isDrawing) return;
        e.preventDefault(); // Prevent scrolling on touch devices
        const pos = getMousePos(e);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI); // 25px brush size
        ctx.fill();
    }

    // Mouse Events
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', () => { isDrawing = false; });
    canvas.addEventListener('mouseleave', () => { isDrawing = false; });

    // Touch Events (for mobile)
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    canvas.addEventListener('touchend', () => { isDrawing = false; });
}

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

/* ------------------------------------------------------------- 
   HABIT VISUALIZER LOGIC
------------------------------------------------------------- */
document.getElementById('label-dunya').classList.add('active');

window.toggleHabitView = function () {
    const isChecked = document.getElementById('habit-toggle').checked;
    const viewDunya = document.getElementById('view-dunya');
    const viewAkhirah = document.getElementById('view-akhirah');
    const labelDunya = document.getElementById('label-dunya');
    const labelAkhirah = document.getElementById('label-akhirah');

    if (isChecked) {
        viewDunya.classList.remove('active');
        viewAkhirah.classList.add('active');
        labelDunya.classList.remove('active');
        labelAkhirah.classList.add('active');
    } else {
        viewAkhirah.classList.remove('active');
        viewDunya.classList.add('active');
        labelAkhirah.classList.remove('active');
        labelDunya.classList.add('active');
    }
};
