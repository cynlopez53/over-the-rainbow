// memorial-builder.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('memorialForm');
    const output = document.getElementById('memorialOutput');

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function saveTributeToStorage(tribute) {
        const saved = JSON.parse(localStorage.getItem('rainbowTributes')) || [];
        saved.push({ ...tribute, createdAt: new Date().toISOString() });
        localStorage.setItem('rainbowTributes', JSON.stringify(saved));
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('petName').value;
            const type = document.getElementById('petType').value;
            const birth = document.getElementById('birthDate').value;
            const passing = document.getElementById('passingDate').value;
            const message = document.getElementById('memorialMessage').value;
            const photoFile = document.getElementById('petPhoto').files[0];

            let photoHTML = '';

            function buildOutput() {
                const tributeHTML = `
                    <div class="memorial-card">
                        ${photoHTML}
                        <h2>🌈 In Loving Memory of ${name}</h2>
                        <p><strong>Beloved ${type}</strong></p>
                        ${birth ? `<p><strong>Born:</strong> ${formatDate(birth)}</p>` : ''}
                        ${passing ? `<p><strong>Passed:</strong> ${formatDate(passing)}</p>` : ''}
                        <p>"${message}"</p>
                        <p class="memorial-date">Created on ${new Date().toLocaleDateString()}</p>
                    </div>
                `;
                output.innerHTML = tributeHTML;
                output.classList.add('fade-in');
                output.scrollIntoView({ behavior: 'smooth' });
                saveTributeToStorage({ name, type, birth, passing, message });
            }

            if (photoFile) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    photoHTML = `<img src="${event.target.result}" class="memorial-photo">`;
                    buildOutput();
                };
                reader.readAsDataURL(photoFile);
            } else {
                buildOutput();
            }
        });
    }

    document.getElementById("downloadMemorial").addEventListener("click", () => {
        html2canvas(output.firstElementChild).then(canvas => {
            const link = document.createElement("a");
            const petName = document.getElementById("petName").value || "memorial";
            link.href = canvas.toDataURL("image/png");
            link.download = `${petName}-memorial.png`;
            link.click();
        });
    });
});
