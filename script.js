// Initialize date restrictions on load
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById('dateInput');
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    
    dateInput.setAttribute('min', today);
    dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
});

// Floating background hearts
function createHeart() {
    const h = document.createElement('div');
    h.innerHTML = '💖'; 
    h.className = 'heart';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (Math.random() * 20 + 15) + 'px';
    h.style.animationDuration = (Math.random() * 3 + 4) + 's';
    
    const container = document.getElementById('heart-container');
    if (container) {
        container.appendChild(h);
        setTimeout(() => h.remove(), 7000);
    }
}
setInterval(createHeart, 400);

// Data tracking object
let dateData = { name: "", activity: "", date: "", time: "" };

// Smart "No" button movement that adapts safely to mobile screen sizes
function moveNo() {
    const btn = document.getElementById('noBtn');
    
    // Set a safe padding so it never jumps halfway off the screen
    const padding = 20; 
    const maxX = window.innerWidth - btn.offsetWidth - padding;
    const maxY = window.innerHeight - btn.offsetHeight - padding;
    
    // Calculate coordinates ensuring the button stays inside viewable screen bounds
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
    
    btn.style.position = 'fixed'; 
    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
}

// Step switcher
function nextStep(s) {
    document.querySelectorAll('.step').forEach(d => d.classList.add('hidden'));
    document.getElementById('step' + s).classList.remove('hidden');
}

// Handle activity choices
function saveChoice(choice) {
    if (choice === 'Other') {
        // Unveils the custom text field beautifully without layout glitches
        const customGroup = document.getElementById('customInputGroup');
        customGroup.classList.remove('hidden');
    } else {
        dateData.activity = choice;
        nextStep(3); 
    }
}

// Handle custom text field submission
function submitCustomChoice() {
    const inputField = document.getElementById('customActivityInput');
    const value = inputField.value.trim();

    if (value === "") {
        inputField.placeholder = "Please type something! 🥺";
        return;
    }

    dateData.activity = value;
    nextStep(3); 
}

// Final data processing and spreadsheet dispatch
function finish() {
    const d = document.getElementById('dateInput').value;
    const t = document.getElementById('timeInput').value;
    const name = document.getElementById('nameInput').value;
    const error = document.getElementById('errorMsg');

    // Validation
    if (!d || !t || !name) { 
        error.classList.remove('hidden'); 
        return; 
    }
    error.classList.add('hidden');

    // Update global date payload
    dateData.name = name;
    dateData.date = d;
    dateData.time = t;

    // Calculate pickup time (1 hour prior to date time)
    let [h, m] = t.split(':');
    let pickupHour = parseInt(h) - 1;
    if (pickupHour < 0) pickupHour = 23; 
    let pTime = `${pickupHour.toString().padStart(2, '0')}:${m}`;

    const scriptURL = "https://script.google.com/macros/s/AKfycby9RSlhdoVpyYSfXQb5em4yE3AieGvYBganc1EKK5GFVKFJK0GZUO6yjtWXcXU8b9Pd/exec";
    
    // Sending the payload to Google Apps Script via POST
    fetch(scriptURL, { 
        method: 'POST', 
        mode: 'no-cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name: dateData.name, 
            activity: dateData.activity, 
            date: dateData.date, 
            time: dateData.time, 
            pickupTime: pTime 
        })
    });

    // Fire celebrating confetti
    confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 }, 
        colors: ['#db2777', '#fda4af', '#fff0f5'] 
    });
    
    // Render success screen text dynamically
    document.getElementById('resultText').innerText = `Yay ${dateData.name}! Can't wait for our ${dateData.activity} date on ${dateData.date} at ${dateData.time}. I'll pick you up at ${pTime}!`;
    nextStep(4);
}