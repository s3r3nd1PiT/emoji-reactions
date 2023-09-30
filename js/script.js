const reactionButtons = document.querySelectorAll('.emoji-reaction');

// Fetch current counts and display them
async function loadCounts() {
    const response = await fetch('/.netlify/functions/add-reaction');
    const data = await response.json();

    document.querySelectorAll('.emoji-reaction-container').forEach(container => {
        const id = container.dataset.id;
        if (data[id]) {
            container.querySelectorAll('.emoji-reaction').forEach(button => {
                const emoji = button.dataset.emoji;
                const countSpan = button.querySelector('.emoji-count');
                if (data[id][emoji]) {
                    countSpan.innerText = data[id][emoji];
                }
            });
        }
    });
}

// Animate count from 0 to actual value in 3 seconds
function animateCount(button, targetCount) {
    let currentCount = 0;
    const increment = targetCount / 30; // 30 frames for 3 seconds
    const countSpan = button.querySelector('.emoji-count');
    countSpan.innerText = '0'; // Set initial count to 0
    const interval = setInterval(() => {
        currentCount += increment;
        if (currentCount >= targetCount) {
            clearInterval(interval);
            currentCount = targetCount;
        }
        countSpan.innerText = Math.round(currentCount);
    }, 100); // 100ms interval for smooth animation
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

// Handle button clicks
reactionButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        const emoji = e.target.dataset.emoji || e.target.parentElement.dataset.emoji;
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
            const countSpan = button.querySelector('.emoji-count');
            countSpan.innerText = data.count;
        } else {
            console.error('Unexpected response:', data);
        }

        emojisplosion(button);
    });
});

// Load counts when the page loads
loadCounts();
