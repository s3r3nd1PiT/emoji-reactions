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

function emojisplosion(button, emoji) {
    const explosionCount = 10;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = `${button.offsetTop}px`;
    container.style.left = `${button.offsetLeft}px`;
    document.body.appendChild(container);

    for (let i = 0; i < explosionCount; i++) {
        const span = document.createElement('span');
        span.innerText = emoji;
        span.style.position = 'absolute';
        span.style.fontSize = '20px';
        span.style.transition = 'all 0.5s ease-out';
        span.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
        span.style.opacity = 0;
        container.appendChild(span);
    }

    setTimeout(() => {
        document.body.removeChild(container);
    }, 500);
}

// Modify the button click event listener to add the explosion effect
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
        if (data && data.count) {
            button.innerText = `${emoji} ${data.count}`;
            emojisplosion(button, emoji);
        } else {
            console.error('Unexpected response:', data);
        }
    });
});


// Load counts when the page loads
loadCounts();
