// ===============================
// CUSTOMIZE HEADSTONE SCRIPT
// ===============================

// Elements
const form = document.getElementById("customizeForm");
const preview = document.getElementById("previewArea");

// Listen for form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get values
  const petName = document.getElementById("petName").value.trim();
  const dates = document.getElementById("dates").value.trim();
  const message = document.getElementById("message").value.trim();
  const font = document.getElementById("font").value;

  // Get selected style
  const selectedStyle = document.querySelector("input[name='style']:checked").value;

  // Determine font class
  const fontClass = fontClassName(font);

  // Build preview HTML
  preview.innerHTML = `
    <div class="headstone-preview">
      <img src="assets/images/${selectedStyle}.jpg" 
           alt="Selected Headstone Style">

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
