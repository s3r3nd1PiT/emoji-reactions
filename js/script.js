// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDD9U4hnfQnzEduCfjTqhJE8xHN98iDY2s",
    authDomain: "emoji-reactions-1e77e.firebaseapp.com",
    databaseURL: "https://emoji-reactions-1e77e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "emoji-reactions-1e77e",
    storageBucket: "emoji-reactions-1e77e.appspot.com",
    messagingSenderId: "73302211585",
    appId: "1:73302211585:web:cbb224bfa5e332ea809400"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const reactionButtons = document.querySelectorAll('.emoji-reaction');

// Fetch current counts from Firebase and display them
function loadCounts() {
    database.ref('reactions/').once('value').then((snapshot) => {
        const data = snapshot.val();
        document.querySelectorAll('.emoji-reaction-container').forEach(container => {
            const id = container.dataset.id;
            if (data && data[id]) {
                container.querySelectorAll('.emoji-reaction').forEach(button => {
                    const emoji = button.dataset.emoji;
                    const countSpan = button.querySelector('.emoji-count');
                    if (data[id][emoji]) {
                        countSpan.innerText = data[id][emoji];
                    }
                });
            }
        });
    });
}

// Emojisplosion effect
function emojisplosion(button) {
    const emojiSpan = button.querySelector('.emoji-icon');
    const rect = emojiSpan.getBoundingClientRect();
    const explosionCount = 10;

    for (let i = 0; i < explosionCount; i++) {
        const span = emojiSpan.cloneNode(true);
        span.style.position = 'fixed';
        span.style.left = `${rect.left + window.scrollX}px`;
        span.style.top = `${rect.top + window.scrollY}px`;
        span.style.transition = 'transform 0.5s, opacity 0.5s';
        span.style.transformOrigin = 'center';
        span.style.zIndex = 9999;

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 50;
        const x = distance * Math.cos(angle);
        const y = distance * Math.sin(angle);

        document.body.appendChild(span);

        requestAnimationFrame(() => {
            span.style.transform = `translate(${x}px, ${y}px) scale(0)`;
            span.style.opacity = '0';
        });

        setTimeout(() => {
            document.body.removeChild(span);
        }, 500);
    }
}

// Update reaction count in Firebase
function updateReactionCount(emoji, id) {
    const reactionRef = database.ref('reactions/' + id + '/' + emoji);
    reactionRef.transaction((currentCount) => {
        return (currentCount || 0) + 1;
    });
}

// Handle button clicks
reactionButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const emoji = e.target.dataset.emoji || e.target.parentElement.dataset.emoji;
        const container = e.target.closest('.emoji-reaction-container');
        const id = container.dataset.id;
        updateReactionCount(emoji, id);
        emojisplosion(button);
    });
});

// Animate count from 0 to actual value in 3 seconds
function animateCount(button, targetCount) {
    let currentCount = 0;
    const increment = targetCount / 30; // 30 frames for 3 seconds
    const countSpan = button.querySelector('.emoji-count');
    const interval = setInterval(() => {
        currentCount += increment;
        if (currentCount >= targetCount) {
            clearInterval(interval);
            currentCount = targetCount;
        }
        countSpan.innerText = Math.round(currentCount);
    }, 100); // 100ms interval for smooth animation
}

// Load counts when the page loads
loadCounts();


// Load counts when the page loads
loadCounts();
