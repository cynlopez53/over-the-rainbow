// ===============================
// SHOP → SAVE SELECTED ITEM
// ===============================

document.querySelectorAll(".shop-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.getAttribute("data-item");

    // Save selected item temporarily
    localStorage.setItem("selectedShopItem", item);

    // Redirect user to Tribute Wall
    window.location.href = "tribute-wall.html";
  });
});
