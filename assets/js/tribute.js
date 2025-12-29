// ===============================
// TRIBUTE WALL — HANDLE SHOP ITEMS
// ===============================

// Load tributes from localStorage
let tributes = JSON.parse(localStorage.getItem("tributes")) || [];

// Load selected shop item (if any)
const selectedItem = localStorage.getItem("selectedShopItem");
const purchasedItem = localStorage.getItem("purchasedItem");
const purchaseCompleted = localStorage.getItem("purchaseCompleted");

// Render tributes on page load
renderTributes();

// If user came from the shop with a purchased item, ask where to place it
if (purchaseCompleted && purchasedItem) {
  setTimeout(() => {
    showPlacementPopup(purchasedItem);
    localStorage.removeItem("purchasedItem");
    localStorage.removeItem("purchaseCompleted");
  }, 500);
} else if (selectedItem) {
  showPlacementPopup(selectedItem);
  localStorage.removeItem("selectedShopItem");
}

// ===============================
// RENDER TRIBUTES
// ===============================
function renderTributes() {
  const list = document.getElementById("tribute-list");
  list.innerHTML = "";

  tributes.forEach((t, index) => {
    const card = document.createElement("div");
    card.className = "tribute-card";

    card.innerHTML = `
      <h3>${t.petName}</h3>
      <div class="tribute-meta">${t.petType} • ${t.date}</div>
      <p>${t.message}</p>

      <div class="tribute-items">
        ${t.items.map(i => `<img src="assets/images/${i}.svg" class="tribute-token" alt="${i}">`).join("")}
      </div>
    `;

    list.appendChild(card);
  });
}

// ===============================
// POPUP TO CHOOSE WHICH TRIBUTE
// ===============================
function showPlacementPopup(item) {
  const names = tributes.map(t => t.petName);

  const choice = prompt(
    "Which tribute should receive this item?\n\n" +
    names.map((n, i) => `${i + 1}. ${n}`).join("\n")
  );

  const index = parseInt(choice) - 1;

  if (!tributes[index]) return;

  // Add item to tribute
  tributes[index].items.push(item);

  // Save
  localStorage.setItem("tributes", JSON.stringify(tributes));

  // Re-render
  renderTributes();
}

// ===============================
// FORM SUBMISSION — ADD NEW TRIBUTE
// ===============================
const form = document.getElementById("tribute-form");
if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const newTribute = {
      petName: document.getElementById("petName").value,
      petType: document.getElementById("petType").value,
      ownerName: document.getElementById("ownerName").value,
      date: document.getElementById("tributeDate").value,
      message: document.getElementById("message").value,
      items: [] // Initialize empty items array
    };

    tributes.push(newTribute);
    localStorage.setItem("tributes", JSON.stringify(tributes));

    // Clear form
    form.reset();

    // Re-render
    renderTributes();

    // Scroll to the newly added tribute
    window.scrollTo(0, document.body.scrollHeight);
  });
}
