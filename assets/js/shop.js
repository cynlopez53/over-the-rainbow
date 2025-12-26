console.log("SHOP.JS IS RUNNING");
console.log("renderShop is running");
const items = [
  {
    id: "stone-basic",
    name: "Customizable Headstone – Gentle Stone",
    description: "Add your pet's name, dates, and a short inscription on a soft stone design.",
    price: 12
  },
  {
    id: "candle-golden",
    name: "Golden Candle of Remembrance",
    description: "A softly glowing virtual candle dedicated to your pet, displayed on your tribute.",
    price: 5
  },
  {
    id: "frame-starry",
    name: "Starry Night Photo Frame",
    description: "A star-themed frame for your pet's tribute photo.",
    price: 8
  },
  {
    id: "garden-plot",
    name: "Rainbow Garden Plot",
    description: "A tranquil virtual garden tile where your pet's name appears among flowers.",
    price: 15
  }
];

let cartTotal = 0;

function renderShop() {
  const grid = document.getElementById("shop-grid");
  if (!grid) return;

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "shop-item";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <p class="price">$${item.price.toFixed(2)}</p>
      <button data-id="${item.id}">Add to cart</button>
    `;
    grid.appendChild(card);
  });

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

document.addEventListener("DOMContentLoaded", () => {
  renderShop();
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