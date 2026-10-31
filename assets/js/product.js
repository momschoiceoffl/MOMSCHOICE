const CONFIG = {
  storeName: "MOM'S CHOICE",
  upiId: "yourname@okhdfcbank",
  whatsappNumber: "919876543210"
};

let products = [];
let currentProduct = null;
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

document.addEventListener("DOMContentLoaded", async () => {
  // Setup sidebar open/close logic
  const h = document.getElementById("hamburgerBtn");
  const s = document.getElementById("sidebar");
  const b = document.getElementById("sidebarBackdrop");
  if (h && s && b) {
    h.onclick = () => { s.classList.add("open"); b.classList.add("open"); };
    b.onclick = () => { s.classList.remove("open"); b.classList.remove("open"); };
  }

  const id = new URLSearchParams(location.search).get("id");
  if (!id) { document.getElementById("pdTitle").innerText = "Product not found"; return; }
  try {
    const res = await fetch(`products.json?_t=${Date.now()}`);
    products = await res.json();
  } catch (e) { document.getElementById("pdTitle").innerText = "Could not load products"; return; }
  currentProduct = products.find(p => p.id === id);
  if (!currentProduct || currentProduct.visible === false) { document.getElementById("pdTitle").innerText = "Product not found or hidden"; return; }
  renderProduct();
  renderAlsoLike();
  updateCartUI();
  setupListeners();
});

function renderProduct() {
  const p = currentProduct;
  const imgs = (p.images && p.images.length) ? p.images : [p.image];
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  const sym = typeof getCurrency === 'function' ? getCurrency() : "₹";
  
  const title = (lang === "ta" && p.title_ta) ? p.title_ta : p.title;
  const desc = (lang === "ta" && p.description_ta) ? p.description_ta : (p.description || "");

  document.title = title + " | Mom's Pick";
  document.getElementById("pdHeaderTitle").innerText = title;
  document.getElementById("pdTitle").innerText = title;
  document.getElementById("pdPrice").innerText = sym + p.price.toLocaleString("en-IN");
  document.getElementById("pdMrp").innerText = sym + (p.originalPrice || p.price).toLocaleString("en-IN");
  document.getElementById("pdDesc").innerText = desc;
  const tag = (p.tags && p.tags[0]) ? p.tags[0].replace("_"," ") : (p.tag || "");
  const tagEl = document.getElementById("pdTag");
  if (tag) { tagEl.innerText = tag; tagEl.style.display = "inline-block"; }
  const gallery = document.getElementById("pdGallery");
  gallery.innerHTML = imgs.map(u => `<img src="${u}" alt="${p.title}">`).join("");
  const thumbs = document.getElementById("pdThumbs");
  if (imgs.length > 1) {
    thumbs.innerHTML = imgs.map((u,i) => `<button class="pd-thumb${i===0?" active":""}" data-idx="${i}"><img src="${u}"></button>`).join("");
    thumbs.querySelectorAll(".pd-thumb").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.idx);
        gallery.scrollTo({ left: gallery.clientWidth * i, behavior: "smooth" });
      });
    });
  } else { thumbs.innerHTML = ""; }
  gallery.onscroll = () => {
    const i = Math.round(gallery.scrollLeft / gallery.clientWidth);
    thumbs.querySelectorAll(".pd-thumb").forEach((b,idx) => b.classList.toggle("active", idx === i));
  };

  // Initialize Action Buttons
  const favBtn = document.getElementById("pdFavBtn");
  const wishBtn = document.getElementById("pdWishBtn");
  const shareBtn = document.getElementById("pdShareBtn");
  
  if (favBtn) {
    if (JSON.parse(localStorage.getItem("moms_choice_favs") || "[]").includes(p.id)) favBtn.classList.add("active");
    favBtn.onclick = () => toggleFav(p.id, favBtn);
  }
  if (wishBtn) {
    if (JSON.parse(localStorage.getItem("moms_choice_wish") || "[]").includes(p.id)) wishBtn.classList.add("active");
    wishBtn.onclick = () => toggleWish(p.id, wishBtn);
  }
  if (shareBtn) {
    shareBtn.onclick = () => shareProduct(p.id);
  }
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
  const url = window.location.href;
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

// ── Sidebar Actions (Favourites, Wishlist, Share) ──────────────
function openFavsModal() {
  const s = document.getElementById("sidebar");
  const b = document.getElementById("sidebarBackdrop");
  if (s) s.classList.remove("open");
  if (b) b.classList.remove("open");
  showItemsModal("moms_choice_favs", "My Favorites");
}

function openWishModal() {
  const s = document.getElementById("sidebar");
  const b = document.getElementById("sidebarBackdrop");
  if (s) s.classList.remove("open");
  if (b) b.classList.remove("open");
  showItemsModal("moms_choice_wish", "My Wishlist");
}

function showItemsModal(storageKey, title) {
  const modal = document.getElementById("favsModal");
  const list = document.getElementById("favsModalList");
  const titleEl = document.getElementById("favsModalTitle");
  
  if (!modal) return;
  titleEl.innerText = title;
  
  const savedIds = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  const sym = typeof getCurrency === 'function' ? getCurrency() : "₹";
  
  if (savedIds.length === 0) {
    list.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px 0;">No items added yet.</p>`;
  } else {
    const savedProducts = products.filter(p => savedIds.includes(p.id));
    if (savedProducts.length === 0) {
      list.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px 0;">Saved items are not in the current catalog.</p>`;
    } else {
      list.innerHTML = savedProducts.map(p => {
        const img = (p.images && p.images[0]) || p.image;
        const pTitle = (lang === "ta" && p.title_ta) ? p.title_ta : p.title;
        return `
        <a href="product.html?id=${p.id}" style="display: flex; gap: 12px; text-decoration: none; color: inherit; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; align-items: center; border: 1px solid var(--border-gold-soft);">
          <img src="${img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
          <div style="flex: 1;">
            <h4 style="font-size: 0.9rem; margin-bottom: 4px; color: var(--text);">${pTitle}</h4>
            <div style="color: var(--gold-glow); font-weight: 700; font-size: 0.9rem;">${sym}${p.price.toLocaleString("en-IN")}</div>
          </div>
        </a>`;
      }).join("");
    }
  }
  modal.classList.add("open");
}

function shareStore() {
  const s = document.getElementById("sidebar");
  const b = document.getElementById("sidebarBackdrop");
  if (s) s.classList.remove("open");
  if (b) b.classList.remove("open");
  
  const url = window.location.origin + window.location.pathname.replace('product.html', 'index.html').replace('category.html', 'index.html');
  if (navigator.share) {
    navigator.share({ title: 'Check out Mom\'s Choice!', text: 'Premium sarees, jewelry, and ethnic wear.', url: url }).catch(console.error);
  } else {
    navigator.clipboard.writeText(url);
    alert("Store link copied to clipboard!\n" + url);
  }
}

function renderAlsoLike() {
  const others = products.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 6);
  if (!others.length) return;
  
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  const sym = typeof getCurrency === 'function' ? getCurrency() : "₹";

  document.getElementById("pdAlso").style.display = "block";
  document.getElementById("pdAlsoGrid").innerHTML = others.map(p => {
    const title = (lang === "ta" && p.title_ta) ? p.title_ta : p.title;
    return `
    <a class="pd-also-card" href="product.html?id=${p.id}">
      <img src="${p.image}" alt="${title}">
      <div class="pd-also-title">${title}</div>
      <div class="pd-also-price">${sym}${p.price.toLocaleString("en-IN")}</div>
    </a>`;
  }).join("");
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;
  const ex = cart.find(c => c.id === id);
  if (ex) ex.qty += 1; else cart.push({ ...item, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.innerText = cart.reduce((s,i) => s + i.qty, 0);
  const list = document.getElementById("cartItemsList");
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  const sym = typeof getCurrency === 'function' ? getCurrency() : "₹";
  
  if (!list) return;
  if (cart.length === 0) {
    const emptyMsg = lang === "ta" ? "உங்கள் ஷாப்பிங் பேக் காலியாக உள்ளது." : "Your shopping bag is empty.";
    list.innerHTML = `<p class="empty-msg" style="margin-top: auto; padding-bottom: 20px; text-align: center; color: var(--text-muted);">${emptyMsg}</p>`;
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
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const totalEl = document.getElementById("cartTotalDisplay");
  if (totalEl) totalEl.innerText = sym + total.toLocaleString("en-IN");
}

function setupListeners() {
  document.getElementById("cartOpenBtn").onclick = () => document.getElementById("cartOverlay").classList.add("open");
  document.getElementById("cartCloseBtn").onclick = () => document.getElementById("cartOverlay").classList.remove("open");

  // Also close cart when clicking outside the drawer (on the overlay)
  const cartOverlay = document.getElementById("cartOverlay");
  if (cartOverlay) {
    cartOverlay.onclick = (e) => {
      if (e.target === cartOverlay) cartOverlay.classList.remove("open");
    };
  }
  document.getElementById("pdAddBtn").onclick = () => { addToCart(currentProduct.id); document.getElementById("cartOverlay").classList.add("open"); };
  document.getElementById("pdWaBtn").onclick = () => {
    const p = currentProduct;
    const msg = `🛍️ *Product Enquiry*\n---------------------------------\n• ${p.title} - ₹${p.price}\n---------------------------------\nHi, I want to order this. Please confirm availability.`;
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };
  document.getElementById("checkoutBtn").onclick = () => {
    if (cart.length === 0) return alert("Your bag is empty!");
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const addr = document.getElementById("custAddress").value.trim();
    if (!name || !phone || !addr) return alert("Please fill in your name, phone, and address.");
    const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
    const orderId = "AJ-" + Math.floor(1000 + Math.random() * 9000);
    const itemList = cart.map(i => `• ${i.title} (x${i.qty}) - ₹${i.price * i.qty}`).join("\n");
    const msg = `🛍️ *NEW ORDER: #${orderId}*\n---------------------------------\n${itemList}\n---------------------------------\n💰 *Total:* ₹${total}\n💳 *Payment:* UPI (${CONFIG.upiId})\n\n📍 *Delivery:*\nName: ${name}\nPhone: ${phone}\nAddress: ${addr}\n\n✅ Attaching payment screenshot below.`;
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
    cart = [];
    localStorage.setItem("cart", "[]");
    updateCartUI();
    document.getElementById("cartOverlay").classList.remove("open");
  };
}