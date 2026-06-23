document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById('dateInput');
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    dateInput.setAttribute('min', today);
    dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
});

function createHeart() {
    const h = document.createElement('div');
    h.innerHTML = '💖'; h.className = 'heart';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (Math.random() * 20 + 15) + 'px';
    h.style.animationDuration = (Math.random() * 3 + 4) + 's';
    document.getElementById('heart-container').appendChild(h);
    setTimeout(() => h.remove(), 7000);
}
setInterval(createHeart, 400);

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

function saveChoice(act) { dateData.activity = act; nextStep(3); }

function finish() {
    const d = document.getElementById('dateInput').value;
    const t = document.getElementById('timeInput').value;
    const name = document.getElementById('nameInput').value;
    const error = document.getElementById('errorMsg');

    if (!d || !t || !name) { 
        error.classList.remove('hidden'); 
        return; 
    }
    error.classList.add('hidden');

    let [h, m] = t.split(':');
    let pickupHour = parseInt(h) - 1;
    if (pickupHour < 0) pickupHour = 23; 
    let pTime = `${pickupHour.toString().padStart(2, '0')}:${m}`;

    const scriptURL = "https://script.google.com/macros/s/AKfycby9RSlhdoVpyYSfXQb5em4yE3AieGvYBganc1EKK5GFVKFJK0GZUO6yjtWXcXU8b9Pd/exec";
    
    // Construct the URL with parameters
    const query = `?name=${encodeURIComponent(name)}&activity=${encodeURIComponent(dateData.activity)}&date=${encodeURIComponent(d)}&time=${encodeURIComponent(t)}&pickupTime=${encodeURIComponent(pTime)}`;

    // Use GET instead of POST for reliable parameter parsing in Google Apps Script
    fetch(scriptURL, { 
        method: 'POST', 
        mode: 'no-cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name: name, 
            activity: dateData.activity, 
            date: d, 
            time: t, 
            pickupTime: pTime 
        })
    });

    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#db2777', '#fda4af', '#fff0f5'] });
    document.getElementById('resultText').innerText = `Yay ${name}! Can't wait for our ${dateData.activity} date on ${d} at ${t}. I'll pick you up at ${pTime}!`;
    nextStep(4);
}