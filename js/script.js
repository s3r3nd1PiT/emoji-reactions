// Fetch current counts and display them
async function loadCounts() {
    const response = await fetch('/.netlify/functions/add-reaction');
    const data = await response.json();

    document.querySelectorAll('.emoji-reaction-container').forEach(container => {
        const id = container.dataset.id;
        if (data[id]) {
            container.querySelectorAll('.emoji-reaction').forEach(button => {
                const emoji = button.dataset.emoji;
                if (data[id][emoji]) {
                    animateCount(button, data[id][emoji]);
                }
            });
        }
    });
}

// Animate count from 0 to actual value in 3 seconds
function animateCount(button, targetCount) {
    let currentCount = 0;
    const increment = targetCount / 30; // 30 frames for 3 seconds
    const interval = setInterval(() => {
        currentCount += increment;
        if (currentCount >= targetCount) {
            clearInterval(interval);
            currentCount = targetCount;
        }
        button.innerText = `${button.dataset.emoji} ${Math.round(currentCount)}`;
    }, 100); // 100ms interval for smooth animation
}

// Existing code to handle button clicks
const reactionButtons = document.querySelectorAll('.emoji-reaction');
reactionButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        const emoji = e.target.dataset.emoji;
        const container = e.target.closest('.emoji-reaction-container');
        const id = container.dataset.id;

        const response = await fetch('/.netlify/functions/add-reaction', {
            method: 'POST',
            body: JSON.stringify({ emoji, id }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        button.innerText = `${emoji} ${data.count}`;
    });
});

// Load counts when the page loads
loadCounts();
