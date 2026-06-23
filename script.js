// --- Set date constraints (Today to 1 month from now) ---
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById('dateInput');
    const today = new Date().toISOString().split('T')[0];
    
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    const maxDateString = maxDate.toISOString().split('T')[0];

    dateInput.setAttribute('min', today);
    dateInput.setAttribute('max', maxDateString);
});

// --- Floating Hearts Generator ---
function createHeart() {
    const h = document.createElement('div');
    h.innerHTML = '💖'; 
    h.className = 'heart';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (Math.random() * 20 + 15) + 'px';
    h.style.animationDuration = (Math.random() * 3 + 4) + 's';
    document.getElementById('heart-container').appendChild(h);
    setTimeout(() => h.remove(), 7000);
}
setInterval(createHeart, 400);

// --- Logic ---
let dateData = { activity: "", date: "", time: "" };

function moveNo() {
    const btn = document.getElementById('noBtn');
    btn.style.position = 'fixed'; 
    btn.style.left = Math.random() * (window.innerWidth - 100) + 'px';
    btn.style.top = Math.random() * (window.innerHeight - 50) + 'px';
}

function nextStep(s) {
    document.querySelectorAll('.step').forEach(d => d.classList.add('hidden'));
    document.getElementById('step' + s).classList.remove('hidden');
}

function saveChoice(act) { 
    dateData.activity = act; 
    nextStep(3); 
}

function finish() {
    const d = document.getElementById('dateInput').value;
    const t = document.getElementById('timeInput').value;
    const error = document.getElementById('errorMsg');

    if (!d || !t) {
        error.classList.remove('hidden');
        return;
    } else {
        error.classList.add('hidden');
    }

    // Logic for pickup time (1 hour before)
    let [h, m] = t.split(':');
    let pickupHour = parseInt(h) - 1;
    
    // Safety check: if time is 00:xx, pickup becomes 23:xx
    if (pickupHour < 0) pickupHour = 23; 
    
    let pTime = `${pickupHour.toString().padStart(2, '0')}:${m}`;

    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#db2777', '#fda4af', '#fff0f5']
    });

    document.getElementById('resultText').innerText = 
        `Yay! Can't wait for our ${dateData.activity} date on ${d} at ${t}. I'll pick you up at ${pTime}!`;
    nextStep(4);
}