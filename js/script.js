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
        e.target.innerText = `${emoji} ${data.count}`;
    });
});
