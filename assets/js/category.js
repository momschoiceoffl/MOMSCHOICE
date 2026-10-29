const CONFIG = { storeName: "MOM'S CHOICE", upiId: "yourname@okhdfcbank", whatsappNumber: "919876543210" };

const SAVED_CUSTOMER_KEY = "ma_fashion_customer";
const FREE_SHIPPING_ABOVE = 999;

const SHIPPING_ZONES = [
  { from: 600001, to: 643999, fee:  60, name: "Tamil Nadu" },
  { from: 560001, to: 591999, fee:  80, name: "Karnataka" },
  { from: 670001, to: 695999, fee:  80, name: "Kerala" },
  { from: 500001, to: 539999, fee:  80, name: "Andhra / Telangana" },
  { from: 400001, to: 445999, fee:  90, name: "Maharashtra / Goa" },
  { from: 360001, to: 396999, fee:  90, name: "Gujarat" },
  { from: 110001, to: 122099, fee: 120, name: "Delhi NCR" }
];

function getShippingZone(pincode) {
  const pin = parseInt(pincode, 10);
  if (!pincode || isNaN(pin) || pin < 100000 || pin > 855999) return null;
  return SHIPPING_ZONES.find(z => pin >= z.from && pin <= z.to)
      || { fee: 150, name: "Rest of India" };
}

function loadCustomerDetails() {
  try { return JSON.parse(localStorage.getItem(SAVED_CUSTOMER_KEY) || "null"); } catch(e) { return null; }
}
function saveCustomerDetails(d) {
  try { localStorage.setItem(SAVED_CUSTOMER_KEY, JSON.stringify(d)); } catch(e) {}
}

let products = [];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let activeCat = "all";
let searchQuery = "";
let activeSubCat = "all";
let storeCategories = {};

document.addEventListener("DOMContentLoaded", async () => {
  activeCat = new URLSearchParams(location.search).get("cat") || "all";
  activeSubCat = new URLSearchParams(location.search).get("sub") || "all";
  


  try {
    const res = await fetch(`products.json?_t=${Date.now()}`);
    products = await res.json();
    
    const catRes = await fetch(`categories.json?_t=${Date.now()}`);
    if (catRes.ok) storeCategories = await catRes.json();
  } catch (e) { console.error(e); return; }

  renderSubcategories();
  renderProducts();
  renderSidebarProducts();
  setupSidebar();
  setupSearch();
  setupCart();
  setupCartDrawer();
  restoreSavedCustomer();
  updateCartUI();
});

function translateCategoryLocal(cat) {
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  if (lang !== "ta") return cat;
  const map = {
    "Sarees": "புடவைகள்", "Necklaces": "நெக்லஸ்கள்", "Earrings": "காதணிகள்",
    "Bangles": "வளையல்கள்", "Rings": "மோதிரங்கள்", "Ornaments": "அலங்காரங்கள்",
    "Accessories": "பாகங்கள்", "Silk": "பட்டு", "Cotton": "பருத்தி", "Designer": "டிசைனர்",
    "Choker": "சோக்கர்", "Long": "நீளமானது", "Pendant": "பெண்டென்ட்", "Set": "செட்",
    "Jhumka": "ஜிமிக்கி", "Studs": "ஸ்டட்ஸ்", "Drops": "டிராப்ஸ்", "Hoops": "ஹூப்ஸ்",
    "Kada": "கடா", "Bracelet": "ப்ரேஸ்லெட்", "Adjustable": "அட்ஜஸ்டபிள்", "Statement": "ஸ்டேட்மென்ட்",
    "Maang Tikka": "மாங் டிக்கா", "Hair Pin": "ஹேர் பின்",
    "Bags": "பைகள்", "Clutches": "கிளட்ச்", "Belts": "பெல்ட்ஸ்"
  };
  return map[cat] || cat;
}

function renderSubcategories() {
  const bar = document.getElementById("subcategoryBar");
  if (!bar) return;
  if (activeCat === "all") { bar.innerHTML = ""; return; }
  
  const subs = storeCategories[activeCat] || ["General"];
  const isTa = (localStorage.getItem("moms_pick_lang") || "en") === "ta";
  const allTxt = isTa ? "அனைத்தும்" : "All";

  bar.innerHTML = `<button class="sub-btn ${activeSubCat === 'all' ? 'active' : ''}" onclick="setSubCat('all')">${allTxt}</button>` + 
    subs.map(s => {
      const sName = translateCategoryLocal(s);
      return `<button class="sub-btn ${activeSubCat === s ? 'active' : ''}" onclick="setSubCat('${s}')">${sName}</button>`;
    }).join("");
}

function setSubCat(sub) {
  activeSubCat = sub;
  renderSubcategories();
  renderProducts(true); // Reset to page 1 when filter changes
}
// Initialize with default "all"
setTimeout(() => renderProducts(), 1000);

function renderProducts() {
  let list = products;
  if (activeCat !== "all") list = list.filter(p => p.category === activeCat);
  if (activeSubCat !== "all") list = list.filter(p => p.subcategory === activeSubCat);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(q) || (p.description||"").toLowerCase().includes(q));
  }
  
  // Alphabetical sort
  list.sort((a, b) => a.title.localeCompare(b.title));
  const c = document.getElementById("productsContainer");
  if (!list.length) { c.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px 0;">No products.</p>`; return; }
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  const sym = typeof getCurrency === 'function' ? getCurrency() : "₹";
  const btnCart = typeof t === 'function' ? t("add_to_cart") : "Add to Cart";
  const btnWa = typeof t === 'function' ? t("send_wa") : "Send Order on WhatsApp";

  c.innerHTML = list.map(p => {
    const thumb = (p.images && p.images[0]) || p.image || "";
    const badge = (p.tags && p.tags[0]) ? p.tags[0].replace("_"," ") : "";
    const title = (lang === "ta" && p.title_ta) ? p.title_ta : p.title;
    const catName = typeof translateCategoryLocal === 'function' ? translateCategoryLocal(p.category) : p.category;

    return `
      <div class="product-card">
        <div class="img-box" onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer;">
          <img src="${thumb}" alt="${title}" loading="lazy">
          ${badge ? `<span class="product-badge">${badge}</span>` : ""}
        </div>
        <div class="product-info">
          <div>
            <h4>${title}</h4>
            <div class="price-row" style="margin-bottom: 8px;">
              <span class="current-price">${sym}${p.price.toLocaleString("en-IN")}</span>
              <span class="mrp-price">${sym}${(p.originalPrice||p.price).toLocaleString("en-IN")}</span>
            </div>
            <div class="product-actions-row">
              <button class="action-icon-btn fav-btn" onclick="toggleFav('${p.id}', this)" title="Favorite">❤</button>
              <button class="action-icon-btn wish-btn" onclick="toggleWish('${p.id}', this)" title="Wishlist">🔖</button>
              <button class="action-icon-btn" onclick="shareProduct('${p.id}')" title="Share">🔗</button>
            </div>
          </div>
          <button class="btn-add" onclick="addToCart('${p.id}')">${btnCart}</button>
          <button class="btn-wa-card" onclick="checkoutSingleProduct('${p.id}')">${btnWa}</button>
        </div>
      </div>`;
  }).join("");

  // Add Pagination
  if (totalPages > 1) {
    html += `<div class="pagination">`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    html += `</div>`;
  }

  c.innerHTML = html;
}

function goToPage(n) {
  currentPage = n;
  renderProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addToCart(id) {
  const p = products.find(x => x.id === id); if (!p) return;
  const ex = cart.find(c => c.id === id);
  if (ex) ex.qty += 1; else cart.push({ ...p, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}



function updateCartUI() {
  const el = document.getElementById("cartCount");
  if (el) el.innerText = cart.reduce((s,i) => s + i.qty, 0);

  const list = document.getElementById("cartItemsList");
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  const sym = typeof getCurrency === 'function' ? getCurrency() : "₹";
  
  if (!list) return;
  if (cart.length === 0) {
    const emptyMsg = lang === "ta" ? "உங்கள் ஷாப்பிங் பேக் காலியாக உள்ளது." : "Your shopping bag is empty.";
    list.innerHTML = `<p class="empty-msg">${emptyMsg}</p>`;
  } else {
    list.innerHTML = cart.map((i, idx) => {
      const title = (lang === "ta" && i.title_ta) ? i.title_ta : i.title;
      return `
      <div class="cart-item">
        <div><strong>${title}</strong><div>${sym}${i.price} × ${i.qty}</div></div>
        <button onclick="removeFromCart(${idx})" style="background:none;border:none;color:red;cursor:pointer;">✕</button>
      </div>`;
    }).join("");
  }
  updateShippingTotals();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateShippingTotals() {
  const subtotalEl = document.getElementById("cartSubtotalDisplay");
  const shippingEl = document.getElementById("cartShippingDisplay");
  const totalEl    = document.getElementById("cartTotalDisplay");
  const pinEl      = document.getElementById("custPincode");
  if (!totalEl) return;

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  let shipping = 0;
  let zoneName = "";

  if (subtotal >= FREE_SHIPPING_ABOVE) {
    shipping = 0;
    zoneName = "Free";
  } else if (pinEl && pinEl.value.trim().length === 6) {
    const zone = getShippingZone(pinEl.value.trim());
    if (zone) { shipping = zone.fee; zoneName = zone.name; }
  }

  const grand = subtotal + shipping;
  if (subtotalEl) subtotalEl.innerText = `₹${subtotal.toLocaleString("en-IN")}`;
  if (shippingEl) shippingEl.innerText = shipping === 0
    ? "Free"
    : `₹${shipping.toLocaleString("en-IN")}${zoneName ? " (" + zoneName + ")" : ""}`;
  totalEl.innerText = `₹${grand.toLocaleString("en-IN")}`;
  return { subtotal, shipping, grand, zoneName };
}

function restoreSavedCustomer() {
  const c = loadCustomerDetails();
  if (!c) return;
  const fields = {
    custName: c.name, custPhone: c.phone,
    custHouse: c.house, custArea: c.area,
    custDistrict: c.district, custState: c.state,
    custPincode: c.pincode
  };
  for (const id in fields) {
    const el = document.getElementById(id);
    if (el && fields[id]) el.value = fields[id];
  }
  const sv = document.getElementById("saveDetails");
  if (sv) sv.checked = true;
}

function openCheckout() {
  document.getElementById("cartOverlay").classList.add("open");
}

function setupCartDrawer() {
  const cartBtn = document.getElementById("cartOpenBtn");
  if (cartBtn) cartBtn.onclick = openCheckout;
  const closeBtn = document.getElementById("cartCloseBtn");
  if (closeBtn) closeBtn.onclick = () => document.getElementById("cartOverlay").classList.remove("open");

  const pinEl = document.getElementById("custPincode");
  if (pinEl) pinEl.addEventListener("input", updateShippingTotals);

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.onclick = () => {
    if (cart.length === 0) return alert("Your bag is empty!");

    const name     = document.getElementById("custName").value.trim();
    const phone    = document.getElementById("custPhone").value.trim();
    const house    = (document.getElementById("custHouse")    || {}).value || "";
    const area     = (document.getElementById("custArea")     || {}).value || "";
    const district = (document.getElementById("custDistrict") || {}).value || "";
    const state    = (document.getElementById("custState")    || {}).value || "";
    const pincode  = (document.getElementById("custPincode")  || {}).value || "";
    const save     = (document.getElementById("saveDetails")  || {}).checked;

    if (!name || !phone || !house || !area || !district || !state) {
      return alert("Please fill in all required fields.");
    }
    if (pincode && !/^\d{6}$/.test(pincode.trim())) {
      return alert("Pincode must be 6 digits.");
    }

    const fullAddr = `${house}, ${area}, ${district}, ${state} - ${pincode}`.trim();

    if (save) saveCustomerDetails({ name, phone, house, area, district, state, pincode: pincode.trim() });

    const totals = updateShippingTotals();
    const orderId = "AJ-" + Math.floor(1000 + Math.random() * 9000);

    const order = {
      orderId, name, phone,
      addr: fullAddr,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.grand,
      zone: totals.zoneName,
      items: [...cart]
    };

    triggerWhatsApp(order);
  };
}

function checkoutSingleProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...p, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
  const drawer = document.getElementById("cartOverlay");
  if (drawer) drawer.classList.add("open");
}

function setupSidebar() {
  const s = document.getElementById("sidebar"), b = document.getElementById("sidebarBackdrop"), h = document.getElementById("hamburgerBtn");
  if (!s) return;
  const open = () => { s.classList.add("open"); b.classList.add("open"); };
  const close = () => { s.classList.remove("open"); b.classList.remove("open"); };
  h.addEventListener("click", () => s.classList.contains("open") ? close() : open());
  b.addEventListener("click", close);
}

function setupSearch() {
  const t = document.getElementById("searchToggle"), bar = document.getElementById("searchBar"), inp = document.getElementById("searchInput"), c = document.getElementById("searchClose");
  if (!t || !bar) return;
  t.addEventListener("click", () => { bar.classList.toggle("open"); if (bar.classList.contains("open")) inp.focus(); });
  c.addEventListener("click", () => { bar.classList.remove("open"); inp.value = ""; searchQuery = ""; renderProducts(); });
  inp.addEventListener("input", () => { searchQuery = inp.value.trim(); renderProducts(true); });
}

function setupCart() {



}



// Favorites & Wishlist Logic
function toggleFav(id, btn) {
  let favs = JSON.parse(localStorage.getItem("moms_choice_favs") || "[]");
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
    btn.classList.remove("active");
  } else {
    favs.push(id);
    btn.classList.add("active");
  }
  localStorage.setItem("moms_choice_favs", JSON.stringify(favs));
}

function toggleWish(id, btn) {
  let wish = JSON.parse(localStorage.getItem("moms_choice_wish") || "[]");
  if (wish.includes(id)) {
    wish = wish.filter(w => w !== id);
    btn.classList.remove("active");
  } else {
    wish.push(id);
    btn.classList.add("active");
  }
  localStorage.setItem("moms_choice_wish", JSON.stringify(wish));
}

function shareProduct(id) {
  const url = window.location.origin + window.location.pathname.replace("index.html", "").replace("category.html", "") + "product.html?id=" + id;
  if (navigator.share) {
    navigator.share({
      title: 'Check out this product on Mom\'s Choice!',
      url: url
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!\n" + url);
  }
}

function triggerWhatsApp(order) {
  const itemList = order.items.map(i => `• ${i.title} (x${i.qty}) - ₹${i.price * i.qty}`).join("\n");
  const shipLine = order.shipping === 0
    ? `🚚 Shipping: Free`
    : `🚚 Shipping: ₹${order.shipping}${order.zone ? " (" + order.zone + ")" : ""}`;
  const msg = `🛍️ *NEW ORDER: #${order.orderId}*\n` +
              `---------------------------------\n${itemList}\n---------------------------------\n` +
              `🧾 Subtotal: ₹${order.subtotal}\n${shipLine}\n` +
              `💰 *Grand Total: ₹${order.total}*\n` +
              `💳 *Payment:* UPI (${CONFIG.upiId})\n\n` +
              `📍 *Delivery:*\nName: ${order.name}\nPhone: ${order.phone}\nAddress: ${order.addr}\n\n` +
              `✅ *Attaching payment screenshot below.*`;
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  document.getElementById("upiModal").classList.remove("open");
  cart = [];
  localStorage.setItem("cart", "[]");
  updateCartUI();
}