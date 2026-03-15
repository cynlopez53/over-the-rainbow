// ===============================
// CUSTOMIZE HEADSTONE SCRIPT
// ===============================

// Elements
const form = document.getElementById("customizeForm");
const preview = document.getElementById("previewArea");
const photoInput = document.getElementById("petPhoto");

// Handle photo upload preview
photoInput.addEventListener("change", function(e) {
  if (e.target.files && e.target.files[0]) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const photoUrl = event.target.result;
      // Store the photo for use in the preview
      localStorage.setItem('uploadedPetPhoto', photoUrl);
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});

// Listen for form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get values
  const petName = document.getElementById("petName").value.trim();
  const dates = document.getElementById("dates").value.trim();
  const message = document.getElementById("message").value.trim();
  const font = document.getElementById("font").value;

  // Get selected style input element
  const selectedInput = document.querySelector("input[name='style']:checked");
  const selectedStyle = selectedInput ? selectedInput.value : null;
  const selectedItemId = selectedInput ? selectedInput.dataset.item : null;

  // Determine font class
  const fontClass = fontClassName(font);

  // Get uploaded photo if available
  const uploadedPhoto = localStorage.getItem('uploadedPetPhoto') || null;

  // Build preview HTML for free style
  const photoHtml = uploadedPhoto 
    ? `<img src="${uploadedPhoto}" alt="Pet Photo" style="max-width: 200px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">` 
    : '';

  preview.innerHTML = `
    <div class="headstone-preview">
      <img src="assets/images/${selectedStyle === 'style1' ? 'black.jpg' : 'rose.jpg'}" 
           alt="Selected Headstone Style">

      ${photoHtml}

      <div class="${fontClass}">
        <h2>${petName}</h2>
        ${dates ? `<p>${dates}</p>` : ""}
        ${message ? `<p>"${message}"</p>` : ""}
      </div>
    </div>
  `;
});

// Helper: return CSS class name for selected font
function fontClassName(option) {
  switch (option) {
    case "script":
      return "script";
    case "bold":
      return "bold";
    default:
      return ""; // serif is default
  }
}
