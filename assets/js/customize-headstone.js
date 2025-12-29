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

  // Get selected style input element
  const selectedInput = document.querySelector("input[name='style']:checked");
  const selectedStyle = selectedInput ? selectedInput.value : null;
  const selectedItemId = selectedInput ? selectedInput.dataset.item : null;
  const selectedPrice = selectedInput ? parseFloat(selectedInput.dataset.price || 0) : 0;

  // Determine font class
  const fontClass = fontClassName(font);

  // If selected style costs money, redirect user to shop to purchase it
  if (selectedPrice > 0) {
    // store the intended headstone selection so shop can prefill
    localStorage.setItem('desiredHeadstoneItem', selectedItemId);
    localStorage.setItem('desiredHeadstonePetName', petName);
    localStorage.setItem('desiredHeadstoneDates', dates);
    localStorage.setItem('desiredHeadstoneMessage', message);
    // send user to shop and open prefill for the selected headstone
    window.location.href = `shop.html?prefill=${encodeURIComponent(selectedItemId)}`;
    return;
  }

  // Build preview HTML for free style
  preview.innerHTML = `
    <div class="headstone-preview">
      <img src="assets/images/${selectedStyle}.jpg" 
           alt="Selected Headstone Style">

      <div class="${fontClass}">
        <h2>${petName}</h2>
        ${dates ? `<p>${dates}</p>` : ""}
        ${message ? `<p>\"${message}\"</p>` : ""}
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
