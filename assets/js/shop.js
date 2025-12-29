// ===============================
// SHOP → SAVE SELECTED ITEM
// ===============================

const itemPrices = {
  "lavender": 2,
  "candle": 3,
  "heart": 1,
  "wings": 4,
  "headstone-style2": 10,
  "headstone-style3": 15
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
  
  // Save the purchase to localStorage so tribute-wall can process it
  localStorage.setItem('purchasedItem', item);
  localStorage.setItem('purchaseCompleted', 'true');
  
  // After payment, redirect to tribute wall
  setTimeout(() => {
    window.location.href = "tribute-wall.html";
  }, 2000);
}

// If shop page is opened with a prefill parameter, open payment modal for that item
document.addEventListener('DOMContentLoaded', () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const prefill = params.get('prefill');
    if (prefill) {
      const price = itemPrices[prefill];
      if (price !== undefined) {
        // store selection in localStorage so we can finish checkout flow
        localStorage.setItem('selectedShopItem', prefill);
        localStorage.setItem('shopItemPrice', price);
        showPaymentModal(prefill, price);
      }
    }

    // If user clicked 'Buy Headstone' from shop after checkout, and we have desired headstone details stored,
    // complete the headstone creation and add to tribute (simulate by redirecting to tribute-wall).
    // This is intentionally lightweight; integrate server-side logic for production.
    const desired = localStorage.getItem('desiredHeadstoneItem');
    if (desired && params.get('prefill') && params.get('prefill').startsWith('headstone')) {
      // After purchase flow completes, preserve desired details in localStorage so tribute-wall can pick them up
      // (tribute-wall.js should read these and create the memorial token)
      // Keep the data; shop checkout will redirect to tribute-wall after payment by default.
    }
  } catch (e) {
    console.warn('Shop prefill handling failed', e);
  }
});
