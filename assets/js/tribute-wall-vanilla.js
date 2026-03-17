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
            ${tribute.photo ? `<img src="${escapeHtml(tribute.photo)}" alt="${escapeHtml(tribute.petName)}" class="tribute-photo">` : ''}
            <h3>${escapeHtml(tribute.petName)}</h3>
            <p class="tribute-message">${escapeHtml(tribute.message)}</p>
            ${tribute.candle ? '<div class="candle">🕯</div>' : ''}
            <div class="tribute-actions">
                <button class="love-btn" onclick="sendLove(${index})">
                    ❤️ ${tribute.loveCount || 0} Love${(tribute.loveCount || 0) !== 1 ? 's' : ''}
                </button>
            </div>
        </div>
    `).join('');
}

// Sanitize HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function setupForm() {
    const form = document.getElementById('tribute-form');
    const photoInput = document.getElementById('photo');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const tribute = {
            petName: escapeHtml(String(formData.get('petName') || '').trim()),
            message: escapeHtml(String(formData.get('message') || '').trim()),
            candle: formData.get('candle') === 'on',
            loveCount: 0
        };

        // Validate required fields
        if (!tribute.petName || !tribute.message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Handle photo
        const photoFile = photoInput.files[0];
        if (photoFile) {
            // Validate file type and size
            if (!photoFile.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                return;
            }
            if (photoFile.size > 5 * 1024 * 1024) { // 5MB limit
                alert('Image file is too large. Please choose a smaller image.');
                return;
            }

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
    try {
        const stored = localStorage.getItem('tributes');
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        // Validate that it's an array
        if (!Array.isArray(parsed)) return [];

        // Sanitize each tribute
        return parsed.map(tribute => ({
            petName: escapeHtml(String(tribute.petName || '')),
            message: escapeHtml(String(tribute.message || '')),
            photo: tribute.photo ? escapeHtml(String(tribute.photo)) : null,
            candle: Boolean(tribute.candle),
            loveCount: Math.max(0, parseInt(tribute.loveCount) || 0)
        }));
    } catch (e) {
        console.warn('Invalid tribute data in localStorage, clearing...');
        localStorage.removeItem('tributes');
        return [];
    }
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