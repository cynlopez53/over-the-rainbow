// memorial-builder.js - Complete functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('memorialForm');
    const output = document.getElementById('memorialOutput');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('petName').value;
            const type = document.getElementById('petType').value;
            const birth = document.getElementById('birthDate')?.value || 'Not specified';
            const passing = document.getElementById('passingDate')?.value || 'Not specified';
            const message = document.getElementById('memorialMessage').value;

            // Create tribute HTML
            const tribute = `
                <div class="memorial-card">
                    <h2>🌈 In Loving Memory of ${name}</h2>
                    <p><strong>Beloved ${type}</strong></p>
                    ${birth !== 'Not specified' ? `<p><strong>Born:</strong> ${formatDate(birth)}</p>` : ''}
                    ${passing !== 'Not specified' ? `<p><strong>Passed:</strong> ${formatDate(passing)}</p>` : ''}
                    <p><em>"${message}"</em></p>
                    <p class="memorial-date">Created on ${new Date().toLocaleDateString()}</p>
                </div>
            `;

            // Display the tribute
            if (output) {
                output.innerHTML = tribute;
                output.classList.add('fade-in');
                
                // Scroll to the result
                output.scrollIntoView({ behavior: 'smooth' });
                
                // Save to localStorage (optional - for persistence)
                saveTributeToStorage({ name, type, birth, passing, message });
            }
        });
    }

    // Format date from YYYY-MM-DD to a nicer format
    function formatDate(dateString) {
        if (dateString === 'Not specified') return dateString;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Save tribute to browser storage (optional)
    function saveTributeToStorage(tribute) {
        try {
            const savedTributes = JSON.parse(localStorage.getItem('rainbowTributes')) || [];
            savedTributes.push({
                ...tribute,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('rainbowTributes', JSON.stringify(savedTributes));
        } catch (err) {
            console.log('Could not save tribute to storage');
        }
    }

    // Load saved tributes (optional - you could show on tribute-wall.html)
    function loadSavedTributes() {
        try {
            const savedTributes = JSON.parse(localStorage.getItem('rainbowTributes')) || [];
            console.log('Saved tributes:', savedTributes);
        } catch (err) {
            console.log('Could not load saved tributes');
        }
    }

    // Load any saved data when page opens
    loadSavedTributes();
});
