// Tribute Wall Vanilla JS Implementation

document.addEventListener("DOMContentLoaded", () => {
    loadTributes();
    setupForm();
});

function loadTributes() {
    // For now, load from localStorage or show sample tributes
    const container = document.getElementById('tributes-container');
    const tributes = getStoredTributes();

    if (tributes.length === 0) {
        container.innerHTML = `
            <div class="no-tributes">
                <p>No tributes yet. Be the first to share a memory!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tributes.map((tribute, index) => `
        <div class="tribute-card">
            ${tribute.photo ? `<img src="${tribute.photo}" alt="${tribute.petName}" class="tribute-photo">` : ''}
            <h3>${tribute.petName}</h3>
            <p class="tribute-message">${tribute.message}</p>
            ${tribute.candle ? '<div class="candle">🕯</div>' : ''}
            <div class="tribute-actions">
                <button class="love-btn" onclick="sendLove(${index})">
                    ❤️ ${tribute.loveCount || 0} Love${(tribute.loveCount || 0) !== 1 ? 's' : ''}
                </button>
            </div>
        </div>
    `).join('');
}

function setupForm() {
    const form = document.getElementById('tribute-form');
    const photoInput = document.getElementById('photo');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const tribute = {
            petName: formData.get('petName'),
            message: formData.get('message'),
            candle: formData.get('candle') === 'on',
            loveCount: 0
        };

        // Handle photo
        const photoFile = photoInput.files[0];
        if (photoFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                tribute.photo = e.target.result;
                saveTribute(tribute);
                form.reset();
                loadTributes();
            };
            reader.readAsDataURL(photoFile);
        } else {
            saveTribute(tribute);
            form.reset();
            loadTributes();
        }
    });
}

function getStoredTributes() {
    const stored = localStorage.getItem('tributes');
    return stored ? JSON.parse(stored) : [];
}

function saveTribute(tribute) {
    const tributes = getStoredTributes();
    tributes.unshift(tribute); // Add to beginning
    localStorage.setItem('tributes', JSON.stringify(tributes));
}

function sendLove(index) {
    const tributes = getStoredTributes();
    if (tributes[index]) {
        tributes[index].loveCount = (tributes[index].loveCount || 0) + 1;
        localStorage.setItem('tributes', JSON.stringify(tributes));
        loadTributes();
    }
}