// ===============================
// SHOP → SAVE SELECTED ITEM
// ===============================

const itemPrices = {
  "lavender": 2,
  "candle": 3,
  "heart": 1,
  "wings": 4
};

document.querySelectorAll(".shop-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.getAttribute("data-item");
    const price = itemPrices[item];

    // Save selected item and price
    localStorage.setItem("selectedShopItem", item);
    localStorage.setItem("shopItemPrice", price);

    // Show payment options
    showPaymentModal(item, price);
  });
});

// ===============================
// PAYMENT MODAL
// ===============================

function showPaymentModal(item, price) {
  const modal = document.createElement("div");
  modal.id = "payment-modal";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  modal.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
      <h2 style="color: #6b4fcf; margin-bottom: 10px;">Complete Your Purchase</h2>
      <p style="color: #4a3a7a; margin-bottom: 20px;">
        Item: <strong>${item}</strong><br>
        Amount: <strong>$${price}.00</strong>
      </p>
      
      <h3 style="color: #6b4fcf; font-size: 16px; margin-bottom: 15px;">Choose Payment Method:</h3>
      
      <button onclick="processPayment('paypal', '${item}', ${price})" style="width: 100%; padding: 12px; margin: 8px 0; background: #003087; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
        🅿️ PayPal
      </button>
      
      <button onclick="processPayment('stripe', '${item}', ${price})" style="width: 100%; padding: 12px; margin: 8px 0; background: #635bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
        💳 Credit Card
      </button>
      
      <button onclick="processPayment('venmo', '${item}', ${price})" style="width: 100%; padding: 12px; margin: 8px 0; background: #3d95ce; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
        Venmo
      </button>
      
      <button onclick="closePaymentModal()" style="width: 100%; padding: 12px; margin: 8px 0; background: #ccc; color: #333; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
        Cancel
      </button>
    </div>
  `;

  document.body.appendChild(modal);
}

function closePaymentModal() {
  const modal = document.getElementById("payment-modal");
  if (modal) modal.remove();
}

function processPayment(method, item, price) {
  if (method === "paypal") {
    window.location.href = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=lopezcyndi1971@gmail.com&item_name=${item}+Memorial+Token&amount=${price}&currency_code=USD`;
  } else if (method === "stripe") {
    // Placeholder for Stripe integration
    alert("Stripe payment: You will be redirected to Stripe to complete your $" + price + " purchase for " + item);
    window.location.href = "https://donate.stripe.com/lopezcyndi1971";
  } else if (method === "venmo") {
    alert("To pay via Venmo, search for @lopezcyndi1971 and send $" + price + " with note: '" + item + " memorial token'");
  }
  
  // After payment, redirect to tribute wall
  setTimeout(() => {
    window.location.href = "tribute-wall.html";
  }, 2000);
}
