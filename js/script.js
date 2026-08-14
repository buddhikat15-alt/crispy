// ============================================================
// Crispy Ceylon — storefront logic
// Edit PRODUCTS below to change items, prices, weights, images.
// Edit WHATSAPP_NUMBER to your business WhatsApp (international
// format, no + or spaces, e.g. "94771234567").
// ============================================================

const WHATSAPP_NUMBER = "94768001294"; // TODO: replace with your real WhatsApp number

const PRODUCTS = [
  {
    id: "roasted-cashews",
    name: "Roasted Cashews",
    desc: "Whole Ceylon cashews, oven-roasted and lightly salted.",
    price: 950,
    weight: "100g",
    img: "assets/roasted-cashews.jpg",
    tag: null
  },
  {
    id: "spicy-mix",
    name: "Spicy Mix",
    desc: "Bold, crunchy trail mix of lentils, peanuts and sev.",
    price: 620,
    weight: "100g",
    img: "assets/spicy-mix.jpg",
    tag: "Spicy"
  },
  {
    id: "spicy-corn",
    name: "Spicy Corn",
    desc: "Crunchy roasted corn kernels in a bold chilli coat.",
    price: 580,
    weight: "100g",
    img: "assets/spicy-corn.jpg",
    tag: "Spicy"
  },
  {
    id: "rice-crackers",
    name: "Rice Crackers",
    desc: "Light, crispy rice discs with a subtle spiced seasoning.",
    price: 540,
    weight: "100g",
    img: "assets/rice-crackers.jpg",
    tag: null
  },
  {
    id: "coconut-chips",
    name: "Crispy Coconut Chips",
    desc: "Oven-baked coconut shavings, toasted for a delicate crunch.",
    price: 690,
    weight: "80g",
    img: "assets/coconut-chips.jpg",
    tag: null
  },
  {
    id: "spicy-cassava-chips",
    name: "Spicy Cassava Chips",
    desc: "Hand-sliced cassava, fried crisp with a fiery finish.",
    price: 560,
    weight: "100g",
    img: "assets/spicy-cassava-chips.jpg",
    tag: "Spicy"
  },
  {
    id: "variety-pack",
    name: "Variety Pack",
    desc: "Eight gourmet Sri Lankan snacks in one gift-ready box.",
    price: 3200,
    weight: "800g (8x100g)",
    img: "assets/variety-pack.jpg",
    tag: null
  }
];

const cart = {}; // { productId: qty }

const fmt = (n) => "Rs. " + n.toLocaleString("en-LK");

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product-card">
      <div class="product-media">
        ${p.tag ? `<span class="spice-tag">${p.tag}</span>` : ""}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-meta">
          <span class="product-price">${fmt(p.price)}</span>
          <span class="product-weight">${p.weight}</span>
        </div>
        <button class="add-btn" data-id="${p.id}">Add to bag</button>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.id);
      btn.textContent = "Added ✓";
      setTimeout(() => (btn.textContent = "Add to bag"), 900);
    });
  });
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  updateCartUI();
}

function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find(p => p.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

function cartCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function updateCartUI() {
  document.getElementById("cartCount").textContent = cartCount();
  const itemsEl = document.getElementById("cartItems");
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    itemsEl.innerHTML = `<p class="cart-empty">Your bag is empty. Add a few snacks to get started.</p>`;
  } else {
    itemsEl.innerHTML = ids.map(id => {
      const p = PRODUCTS.find(p => p.id === id);
      const qty = cart[id];
      return `
        <div class="cart-item">
          <img src="${p.img}" alt="${p.name}">
          <div class="cart-item-info">
            <h4>${p.name}</h4>
            <div class="cart-item-row">
              <div class="qty-control">
                <button data-id="${id}" data-action="dec" aria-label="Decrease quantity">−</button>
                <span>${qty}</span>
                <button data-id="${id}" data-action="inc" aria-label="Increase quantity">+</button>
              </div>
              <strong>${fmt(p.price * qty)}</strong>
            </div>
            <button class="remove-item" data-id="${id}" data-action="remove">Remove</button>
          </div>
        </div>
      `;
    }).join("");

    itemsEl.querySelectorAll("[data-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        if (action === "inc") changeQty(id, 1);
        if (action === "dec") changeQty(id, -1);
        if (action === "remove") { delete cart[id]; updateCartUI(); }
      });
    });
  }

  document.getElementById("cartSubtotal").textContent = fmt(cartTotal());
}

function buildWhatsAppMessage() {
  const lines = ["Hi Crispy Ceylon! I'd like to order:", ""];
  Object.entries(cart).forEach(([id, qty]) => {
    const p = PRODUCTS.find(p => p.id === id);
    lines.push(`• ${p.name} (${p.weight}) x${qty} — ${fmt(p.price * qty)}`);
  });
  lines.push("", `Subtotal: ${fmt(cartTotal())}`, "", "Please confirm delivery cost and time. Thank you!");
  return encodeURIComponent(lines.join("\n"));
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}
function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();
  document.getElementById("year").textContent = new Date().getFullYear();

  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);

  document.getElementById("whatsappCheckout").addEventListener("click", () => {
    if (cartCount() === 0) {
      alert("Your bag is empty — add a snack first!");
      return;
    }
    const msg = buildWhatsAppMessage();
    window.open(`https://wa.me/${+94768001294}?text=${msg}`, "_blank");
  });
});
