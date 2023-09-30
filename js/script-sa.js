// Your CSS content as a string
const cssContent = `
body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f4;
}

.emoji-reaction-container {
    display: flex;
    align-items: center;
}

.emoji-reaction {
    background-color: #fff;
    border: none;
    padding: 30px 20px 10px 20px;
    margin: 5px;
    cursor: pointer;
    transition: transform 0.3s, background-color 0.3s;
    font-size: 24px;
    display: flex;
    align-items: center;
    overflow: hidden;
    flex-direction: column;
    justify-content: center;
}

.emoji-icon {
    font-size: 24px;
    transition: transform 0.3s;
    position: relative;
    bottom: 10px; /* Adjust this value to position the emoji higher */
    z-index: 0;
}

.emoji-reaction:hover .emoji-icon {
    transform: scale(2.5);
}

.emoji-count {
    margin-top: 5px;
    z-index: 1;
}
`;

// Function to inject the CSS into the document
function injectCSS(css) {
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);
}

// Call the function to inject the CSS
injectCSS(cssContent);

const reactionButtons = document.querySelectorAll('.emoji-reaction');

// Fetch current counts and animate them
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
        span.style.transition = 'transform 1s, opacity 1s';
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
        }, 1000);
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
