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

// Reference to database
const db = firebase.database();

// Easing function for smoother animation
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Animate count smoothly
function animateCount(element, targetCount) {
    const duration = 1000; // 1 second
    let start = null;
    let currentCount = parseInt(element.innerText) || 0;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / duration;
        const delta = easeInOutQuad(progress) * (targetCount - currentCount);
        const count = currentCount + delta;

        element.innerText = Math.round(count);

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.innerText = targetCount; // Ensure final value is set correctly
        }
    }

    requestAnimationFrame(step);
}

// Fetch current counts and display them
function loadCounts() {
    document.querySelectorAll('.emoji-reaction-container').forEach(container => {
        const id = container.dataset.id;
        const reactionRef = db.ref('reactions/' + id);

        // Listen for changes in the database
        reactionRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                container.querySelectorAll('.emoji-reaction').forEach(button => {
                    const emoji = button.dataset.emoji;
                    const countSpan = button.querySelector('.emoji-count');
                    if (data[emoji]) {
                        const currentCount = parseInt(countSpan.innerText) || 0;
                        if (currentCount !== data[emoji]) {
                            animateCount(countSpan, data[emoji]);
                        }
                    } else {
                        countSpan.innerText = '0'; // Reset to 0 if no data for that emoji
                    }
                });
            }
        });
    });
}

// Handle button clicks
document.querySelectorAll('.emoji-reaction').forEach(button => {
    button.addEventListener('click', (e) => {
        const emoji = e.target.dataset.emoji || e.target.parentElement.dataset.emoji;
        const container = e.target.closest('.emoji-reaction-container');
        const id = container.dataset.id;
        const reactionRef = db.ref('reactions/' + id + '/' + emoji);

        // Increment the count in the database
        reactionRef.transaction((count) => {
            return (count || 0) + 1;
        });
    });
});

// Load counts when the page loads
loadCounts();
