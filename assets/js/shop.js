document.addEventListener("DOMContentLoaded", () => {
  renderShop();

  const grid = document.getElementById("shop-grid");
  if (grid) {
    grid.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "button") {
        const itemId = e.target.getAttribute("data-id");
        const item = items.find((i) => i.id === itemId);
        if (item) {
          cartTotal += item.price;
          document.getElementById("cart-total").textContent =
            "$" + cartTotal.toFixed(2);
        }
      }
    });
  }

  const checkoutBtn = document.getElementById("checkout-btn");
  const msg = document.getElementById("checkout-message");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cartTotal <= 0) {
        msg.textContent = "Your cart is empty.";
        return;
      }
      msg.textContent =
        "Thank you for your support. This is a demo checkout; no real payment was processed. All virtual item sales are final.";
      cartTotal = 0;
      document.getElementById("cart-total").textContent = "$0.00";
    });
  }
});
