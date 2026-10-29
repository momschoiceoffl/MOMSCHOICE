/* ═══════════════════════════════════════════════════════════════ */
/* [CONFIG] Store settings — EDIT THESE WITH YOUR REAL DETAILS     */
/* ═══════════════════════════════════════════════════════════════ */
const CONFIG = {
  storeName: "MOM'S CHOICE",
  upiId: "yourname@okhdfcbank",       // ← CHANGE: your real UPI ID
  whatsappNumber: "919876543210"      // ← CHANGE: 91 + 10-digit number
};

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
  return SHIPPING_ZONES.find(z => pin >= z.from && pin <= z.to) || { fee: 150, name: "Rest of India" };
}

/* Saved customer details — persist in localStorage */
const SAVED_CUSTOMER_KEY = "ma_fashion_customer";

function saveCustomerDetails(details) {
  try { localStorage.setItem(SAVED_CUSTOMER_KEY, JSON.stringify(details)); } catch(e) {}
}
function loadCustomerDetails() {
  try { return JSON.parse(localStorage.getItem(SAVED_CUSTOMER_KEY) || "null"); } catch(e) { return null; }
}
function clearCustomerDetails() {
  try { localStorage.removeItem(SAVED_CUSTOMER_KEY); } catch(e) {}
}
/* [END CONFIG] */


/* ═══════════════════════════════════════════════════════════════ */
/* [CAROUSEL CONFIG] Slider behavior                               */
/* ═══════════════════════════════════════════════════════════════ */
const CAROUSEL_INTERVAL = 3000;   // ms between slides (3 seconds)
/* [END CAROUSEL CONFIG] */


/* ═══════════════════════════════════════════════════════════════ */
/* [STATE] Global app state                                        */
/* ═══════════════════════════════════════════════════════════════ */
let products = [];
let cart = [];
let pendingOrder = null;

let activeTag = "all";       // current filter chip
let activeCat = "all";       // current category pill
let activeSubCat = "all";    // current subcategory
let storeCategories = {};    // Fetched from categories.json

let carouselIndex = 0;
let carouselTimer = null;
let carouselSlides = [];
/* [END STATE] */


/* ═══════════════════════════════════════════════════════════════ */
/* [INIT] Boot the app                                             */
/* ═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  setupListeners();
  setupSidebar();
  setupSearch();
  setupFooterLinks();
  restoreSavedCustomer();

  const pinEl = document.getElementById("custPincode");
  if (pinEl) pinEl.addEventListener("input", updateShippingTotals);
});

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

function setupSidebar() {
  // Always attach ONE delegated listener at document level.
  // Elements are looked up at click time, so it works even if the
  // header/sidebar render after this function runs.
  document.addEventListener("click", (e) => {
    // ---- Hamburger toggle ----
    const ham = e.target.closest("#hamburgerBtn");
    if (ham) {
      e.preventDefault();
      e.stopPropagation();
      const sidebar  = document.getElementById("sidebar");
      const backdrop = document.getElementById("sidebarBackdrop");
      if (!sidebar || !backdrop) return;
      const isOpen = sidebar.classList.contains("open");
      if (isOpen) {
        sidebar.classList.remove("open");
        backdrop.classList.remove("open");
      } else {
        sidebar.classList.add("open");
        backdrop.classList.add("open");
      }
      return;
    }

    // ---- Backdrop click closes ----
    const backdrop = document.getElementById("sidebarBackdrop");
    if (backdrop && e.target === backdrop) {
      backdrop.classList.remove("open");
      const sidebar = document.getElementById("sidebar");
      if (sidebar) sidebar.classList.remove("open");
      return;
    }

    // ---- Categories drill-down toggle ----
    const catToggle = e.target.closest("#sidebarCategoriesToggle");
    if (catToggle) {
      e.preventDefault();
      const subnav = document.getElementById("sidebarSubnav");
      if (subnav) subnav.classList.toggle("open");
      return;
    }

    // ---- Click on a sidebar link (Home / Login etc.) closes drawer ----
    const link = e.target.closest(".sidebar-link");
    if (link && !link.id) {
      const sidebar  = document.getElementById("sidebar");
      const backdrop = document.getElementById("sidebarBackdrop");
      if (sidebar)  sidebar.classList.remove("open");
      if (backdrop) backdrop.classList.remove("open");
    }
  }, true);   // ← capture phase — fires before other handlers can swallow it
}

function setupSearch() {
  const toggle = document.getElementById("searchToggle");
  const bar    = document.getElementById("searchBar");
  const input  = document.getElementById("searchInput");
  const closeB = document.getElementById("searchClose");
  if (!toggle || !bar) return;

  toggle.addEventListener("click", () => {
    bar.classList.toggle("open");
    if (bar.classList.contains("open")) input.focus();
  });
  closeB.addEventListener("click", () => {
    bar.classList.remove("open");
    input.value = "";
    renderFiltered();
  });

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { renderFiltered(); return; }
    const matches = products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    renderProducts(matches);
  });
}

function setupFooterLinks() {
  // Placeholder — replace "#" in index.html with real URLs later
  document.querySelectorAll(".social-icon").forEach(a => {
    a.addEventListener("click", e => {
      if (a.getAttribute("href") === "#") {
        e.preventDefault();
        const s = a.dataset.social;
        console.log("TODO: link " + s);
      }
    });
  });
}
/* [END INIT] */


/* ═══════════════════════════════════════════════════════════════ */
/* [FETCH] Load products.json                                      */
/* ═══════════════════════════════════════════════════════════════ */
async function fetchProducts() {
  try {
    const res = await fetch(`products.json?_t=${Date.now()}`);
    products = await res.json();
    
    // Fetch categories
    try {
      const catRes = await fetch(`categories.json?_t=${Date.now()}`);
      storeCategories = await catRes.json();
    } catch(e) { console.warn("No categories.json found, using fallback."); }

    // Backwards compatibility: if a product has old single "tag"
    // but no "tags" array, convert it.
    products.forEach(p => {
      if (!Array.isArray(p.tags)) {
        p.tags = p.tag ? [String(p.tag).toLowerCase().replace(/\s+/g, "_")] : [];
      }
    });

    initCarousel();
    renderCategoryCards();
    renderSidebarProducts();
    renderSubcategories();
  } catch (e) {
    console.error("Could not load products.json", e);
  }
}

function renderCategoryCards() {
  const grid = document.getElementById("categoryGrid");
  if (!grid) return;
  const cats = [...new Set(products.map(p => p.category))].sort();
  renderSidebarSubnav(cats);
  
  grid.innerHTML = cats.map(cat => {
    const catProducts = products.filter(p => p.category === cat);
    const coverImages = catProducts.map(p => (p.images && p.images[0]) || p.image).filter(Boolean);
    
    let savedIdx = 0;
    try {
      const saved = localStorage.getItem("cat_slide_" + cat);
      if (saved !== null) savedIdx = parseInt(saved) % coverImages.length;
    } catch(e) {}

    const thumb = coverImages.length ? coverImages[savedIdx] : "";
    const imgTag = thumb
      ? `<img class="category-card-img cat-auto-slide" src="${thumb}" data-cat="${cat}" data-images='${JSON.stringify(coverImages)}' data-index="${savedIdx}" alt="${cat}">`
      : `<div class="category-card-img" style="display:flex;align-items:center;justify-content:center;font-size:2rem;color:var(--text-muted);">🖼️</div>`;
      
    const catName = typeof translateCategory === 'function' ? translateCategory(cat) : cat;
      
    return `
      <a class="category-card" href="category.html?cat=${encodeURIComponent(cat)}" onclick="sessionStorage.setItem('lastCat', '${cat}')">
        ${imgTag}
        <div class="category-card-name">${catName}</div>
      </a>`;
  }).join("");

  // Start the 10-second interval for category images
  setInterval(() => {
    document.querySelectorAll(".cat-auto-slide").forEach(img => {
      try {
        const cat = img.getAttribute("data-cat");
        const imgs = JSON.parse(img.getAttribute("data-images"));
        if (imgs.length > 1) {
          let idx = parseInt(img.getAttribute("data-index")) + 1;
          if (idx >= imgs.length) idx = 0;
          
          img.style.opacity = "0.3";
          setTimeout(() => {
            img.src = imgs[idx];
            img.setAttribute("data-index", idx);
            img.style.opacity = "1";
            
            // Save to memory so it persists across refreshes
            try { localStorage.setItem("cat_slide_" + cat, idx); } catch(e) {}
          }, 200);
        }
      } catch (e) {}
    });
  }, 10000); // 10 seconds

  // Save the current index if the user clicks away or closes the tab
  window.addEventListener("beforeunload", () => {
    document.querySelectorAll(".cat-auto-slide").forEach(img => {
      try {
        const cat = img.getAttribute("data-cat");
        const idx = img.getAttribute("data-index");
        if (cat && idx) localStorage.setItem("cat_slide_" + cat, idx);
      } catch(e) {}
    });
  });
}

function renderSidebarProducts() {
  const list = document.getElementById("sidebarProductList");
  if (!list) return;
  
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  
  list.innerHTML = products.map(p => {
    const title = (lang === "ta" && p.title_ta) ? p.title_ta : p.title;
    return `<a href="product.html?id=${p.id}" class="sidebar-sublink" style="border-bottom: none;">• ${title}</a>`;
  }).join("");
}

function renderSidebarSubnav(cats) {
  const subnav = document.getElementById("sidebarSubnav");
  if (!subnav) return;
  if (!cats.length) {
    subnav.innerHTML = `<span class="sidebar-sublink">No categories yet</span>`;
    return;
  }
  
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  const noSubText = lang === "ta" ? "துணை வகைகள் இல்லை" : "No subcategories";
  const noCatText = lang === "ta" ? "வகைகள் இல்லை" : "No categories yet";

  let html = "";
  cats.forEach(cat => {
    const count = products.filter(p => p.category === cat).length;
    const subcats = storeCategories[cat] || [];
    
    const catName = typeof translateCategory === 'function' ? translateCategory(cat) : cat;
    
    html += `<div style="padding: 4px 16px;">`;
    html += `<a href="category.html?cat=${encodeURIComponent(cat)}" style="color: var(--primary); font-weight: bold; text-decoration: none; display: block; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">${catName} (${count})</a>`;
    
    if (subcats.length) {
        html += `<div style="padding-left: 12px; margin-top: 4px;">`;
        subcats.forEach(sub => {
            const subName = typeof translateCategory === 'function' ? translateCategory(sub) : sub;
            html += `<a href="category.html?cat=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}" style="color: var(--text-muted); font-size: 0.85rem; text-decoration: none; display: block; padding: 4px 0;">↳ ${subName}</a>`;
        });
        html += `</div>`;
    }
    html += `</div>`;
  });
  subnav.innerHTML = html;
}
/* [END FETCH] */


/* ═══════════════════════════════════════════════════════════════ */
/* [SCRAMBLE] Sort products: bestsellers first, rest random        */
/* -------------------------------------------------------------- */
/* Order rules when nothing is filtered:                           */
/*   1. Products tagged "bestseller" (in original order)           */
/*   2. Products tagged "most_loved"                               */
/*   3. Everything else — shuffled randomly                        */
/* ═══════════════════════════════════════════════════════════════ */
function scrambleProducts(list) {
  const bestsellers = list.filter(p => p.tags.includes("bestseller"));
  const mostLoved   = list.filter(p => p.tags.includes("most_loved") && !p.tags.includes("bestseller"));
  const rest        = list.filter(p =>
    !p.tags.includes("bestseller") && !p.tags.includes("most_loved")
  );

  // Fisher–Yates shuffle on "rest"
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }

  return [...bestsellers, ...mostLoved, ...rest];
}
/* [END SCRAMBLE] */


/* ═══════════════════════════════════════════════════════════════ */
/* [FILTER LOGIC] Combine tag chip + category pill                 */
/* ═══════════════════════════════════════════════════════════════ */
function getFilteredProducts() {
  let list = [...products];

  // Category filter
  if (activeCat !== "all") {
    list = list.filter(p => p.category === activeCat);
  }

  // Subcategory filter (Mock logic: since products.json lacks subcategory, this just filters alphabetically if selected)
  // In the future, update this to: list.filter(p => p.subcategory === activeSubCat)
  
  // Tag filter
  if (activeTag !== "all") {
    list = list.filter(p => p.tags.includes(activeTag));
  }

  // Sort: only scramble when both filters are "all"
  if (activeTag === "all" && activeCat === "all") {
    list = scrambleProducts(list);
  } else {
    // Alphabetical sort when filtering
    list.sort((a, b) => a.title.localeCompare(b.title));
  }

  return list;
}

let currentPage = 1;
const PER_PAGE = 12; // 3 columns x 4 rows = 12 items per page

function renderFiltered() {
  currentPage = 1;
  renderProducts(getFilteredProducts());
}
/* [END FILTER LOGIC] */


/* ═══════════════════════════════════════════════════════════════ */
/* [RENDER] Draw product grid                                      */
/* ═══════════════════════════════════════════════════════════════ */
function renderProducts(items) {
  const container = document.getElementById("productsContainer");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1;color:var(--text-muted);text-align:center;padding:40px 0;">No products match this filter.</p>`;
    return;
  }

  if (!items.length) { console.warn("renderProducts: empty list"); }
  const totalPages = Math.ceil(items.length / PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = items.slice(start, start + PER_PAGE);

  const lang = localStorage.getItem("moms_pick_lang") || "en";
  const sym = typeof getCurrency === 'function' ? getCurrency() : "₹";
  const btnCart = typeof t === 'function' ? t("add_to_cart") : "Add to Cart";
  const btnWa = typeof t === 'function' ? t("send_wa") : "Send Order on WhatsApp";

  container.innerHTML = pageItems.map(p => {
    const badge = p.tags.includes("bestseller") ? "Bestseller"
                : p.tags.includes("most_loved") ? "Most Loved"
                : p.tags.includes("trending")   ? "Trending"
                : p.tags.includes("new")        ? "New"
                : p.tags.includes("sale")       ? "Sale"
                : (p.tag || "");

    const title = (lang === "ta" && p.title_ta) ? p.title_ta : p.title;
    const catName = typeof translateCategory === 'function' ? translateCategory(p.category) : p.category;

    return `
    <div class="product-card" id="card-${p.id}">
      <div class="img-box" onclick="location.href='product.html?id=${p.id}'">
        <img src="${p.image}" alt="${title}" loading="lazy">
        ${badge ? `<span class="product-badge">${badge}</span>` : ""}
      </div>
      <div class="product-info">
        <div>
          <h4>${title}</h4>
          <div class="price-row" style="margin-bottom: 8px;">
            <span class="current-price">${sym}${p.price.toLocaleString("en-IN")}</span>
            <span class="mrp-price">${sym}${p.originalPrice.toLocaleString("en-IN")}</span>
          </div>
          <div class="product-actions-row">
            <button class="action-icon-btn fav-btn" onclick="event.stopPropagation(); toggleFav('${p.id}', this)" title="Favorite">❤</button>
            <button class="action-icon-btn wish-btn" onclick="event.stopPropagation(); toggleWish('${p.id}', this)" title="Wishlist">🔖</button>
            <button class="action-icon-btn" onclick="event.stopPropagation(); shareProduct('${p.id}')" title="Share">🔗</button>
          </div>
        </div>
        <button class="btn-add" onclick="event.stopPropagation(); addToCart('${p.id}')">${btnCart}</button>
        <button class="btn-wa-card" onclick="event.stopPropagation(); checkoutSingleProduct('${p.id}')">${btnWa}</button>
      </div>
    </div>
  `;
  }).join("") + renderPagination(totalPages);
}

function renderPagination(totalPages) {
  if (totalPages <= 1) return "";
  let html = `<div class="pagination">`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn${i === currentPage ? " active" : ""}" onclick="goToPage(${i})">${i}</button>`;
  }
  html += `</div>`;
  return html;
}

function goToPage(n) {
  currentPage = n;
  renderFiltered();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
/* [END RENDER] */


/* ═══════════════════════════════════════════════════════════════ */
/* [CAROUSEL] Auto-sliding hero with dots                          */
/* -------------------------------------------------------------- */
/* Slide order: one product from each category, round-robin.       */
/* Example with 3 categories and 3 products each:                  */
/*   CatA#1 → CatB#1 → CatC#1 → CatA#2 → CatB#2 → CatC#2 → ...    */
/* ═══════════════════════════════════════════════════════════════ */
function buildCarouselOrder() {
  // Group products by category
  const byCategory = {};
  products.forEach(p => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  });

  const categories = Object.keys(byCategory);
  const maxLen = Math.max(...categories.map(c => byCategory[c].length));
  const ordered = [];

  // Round-robin: pick 1st from each category, then 2nd, then 3rd…
  for (let i = 0; i < maxLen; i++) {
    categories.forEach(cat => {
      if (byCategory[cat][i]) ordered.push(byCategory[cat][i]);
    });
  }

  return ordered;
}

function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const dots  = document.getElementById("carouselDots");
  if (!track || !dots) return;

  carouselSlides = buildCarouselOrder();

  if (carouselSlides.length === 0) {
    track.innerHTML = `<div class="carousel-loading">No products yet</div>`;
    return;
  }

  // COLUMN 3 — scrolling track
  track.innerHTML = carouselSlides.map((p, index) => {
    const imgs = (p.images && p.images.length) ? p.images : [p.image];
    const coverImg = imgs[0];
    
    const miniImgs = imgs.slice(1).length ? imgs.slice(1) : imgs; 
    const miniTrackHTML = miniImgs.map(img => `<img src="${img}" alt="${p.title}">`).join("");

    const lang = localStorage.getItem("moms_pick_lang") || "en";
    const title = (lang === "ta" && p.title_ta) ? p.title_ta : p.title;
    const desc = (lang === "ta" && p.description_ta) ? p.description_ta : (p.description || "");
    const sym = typeof getCurrency === 'function' ? getCurrency() : "₹";

    return `
    <div class="carousel-pair" data-product-id="${p.id}" data-slide-index="${index}">
      <div class="carousel-col-text">
        <h4 style="font-size: 1rem; color: var(--primary); margin-bottom: 8px;">${title}</h4>
        <div class="desc-price" style="font-size: 1.1rem; font-weight: bold; margin-bottom: 8px;">${sym}${p.price.toLocaleString("en-IN")}</div>
        <div class="desc-text" style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">${desc}</div>
      </div>
      <div class="carousel-col-cover">
        <img src="${coverImg}" alt="${p.title}">
      </div>
      <div class="carousel-col-track">
        <div class="carousel-inner-track" id="innerTrack-${index}">
          ${miniTrackHTML}
        </div>
      </div>
    </div>
  `}).join("");

  dots.innerHTML = carouselSlides.map((_, i) =>
    `<button class="carousel-dot${i === 0 ? " active" : ""}" data-slide="${i}" aria-label="Slide ${i+1}"></button>`
  ).join("");

  carouselIndex = 0;
  updateCarouselPosition();

  track.querySelectorAll(".carousel-pair").forEach(slide => {
    slide.addEventListener("click", () => {
      scrollToProduct(slide.dataset.productId);
    });
  });

  dots.querySelectorAll(".carousel-dot").forEach(dot => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      carouselIndex = Number(dot.dataset.slide);
      updateCarouselPosition();
      restartCarouselTimer();
    });
  });

  const carousel = document.getElementById("heroCarousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", stopCarouselTimer);
    carousel.addEventListener("mouseleave", startCarouselTimer);
    carousel.addEventListener("touchstart", stopCarouselTimer, { passive: true });
    carousel.addEventListener("touchend",   startCarouselTimer, { passive: true });
  }

  startCarouselTimer();
}

function updateCarouselPosition() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;
  track.style.transform = `translateX(-${carouselIndex * 100}%)`;

  document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === carouselIndex);
  });
  
  // Reset mini carousel when main slide changes
  miniCarouselIndex = 0;
  const activePair = document.querySelector(`.carousel-pair[data-slide-index="${carouselIndex}"]`);
  if (activePair) {
      const innerTrack = activePair.querySelector('.carousel-inner-track');
      if (innerTrack) innerTrack.style.transform = `translateX(0%)`;
  }
}

let miniCarouselTimer = null;
let miniCarouselIndex = 0;

function startCarouselTimer() {
  stopCarouselTimer();
  if (carouselSlides.length < 2) return;
  carouselTimer = setInterval(() => {
    carouselIndex = (carouselIndex + 1) % carouselSlides.length;
    updateCarouselPosition();
  }, 15000); // 15 seconds per main product set
}

// The running inner images (4 seconds)
miniCarouselTimer = setInterval(() => {
  const activePair = document.querySelector(`.carousel-pair[data-slide-index="${carouselIndex}"]`);
  if (!activePair) return;
  const innerTrack = activePair.querySelector('.carousel-inner-track');
  if (!innerTrack) return;
  const totalImgs = innerTrack.children.length;
  if (totalImgs <= 1) return;

  miniCarouselIndex = (miniCarouselIndex + 1) % totalImgs;
  innerTrack.style.transform = `translateX(-${miniCarouselIndex * 100}%)`;
}, 4000); // 4 seconds per inner image

function stopCarouselTimer() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
}

function restartCarouselTimer() {
  stopCarouselTimer();
  startCarouselTimer();
}

function scrollToProduct(productId) {
  // If the product isn't visible under the current filter, reset filters
  const visible = getFilteredProducts().some(p => p.id === productId);
  if (!visible) {
    activeTag = "all";
    activeCat = "all";
    document.querySelectorAll(".filter-chip").forEach(c =>
      c.classList.toggle("active", c.dataset.tag === "all")
    );
    document.querySelectorAll(".cat-pill").forEach(c =>
      c.classList.toggle("active", c.dataset.cat === "all")
    );
    renderFiltered();
  }

  const card = document.getElementById(`card-${productId}`);
  if (!card) return;

  card.scrollIntoView({ behavior: "smooth", block: "center" });
  card.classList.remove("highlight");
  void card.offsetWidth;          // force reflow to restart animation
  card.classList.add("highlight");
  setTimeout(() => card.classList.remove("highlight"), 1900);
}
/* [END CAROUSEL] */


/* ═══════════════════════════════════════════════════════════════ */
/* [CART] Add / remove / update                                    */
/* ═══════════════════════════════════════════════════════════════ */
function checkoutSingleProduct(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;
  const ex = cart.find(c => c.id === productId);
  if (ex) ex.qty += 1;
  else cart.push({ ...p, qty: 1 });
  updateCartUI();
  document.getElementById("cartOverlay").classList.add("open");
}

function addToCart(productId) {
  const item = products.find(p => p.id === productId);
  if (!item) return;

  const inCart = cart.find(c => c.id === productId);
  if (inCart) {
    inCart.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  document.getElementById("cartCount").innerText = cart.reduce((sum, i) => sum + i.qty, 0);

  const cartList = document.getElementById("cartItemsList");
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  const sym = typeof getCurrency === 'function' ? getCurrency() : "₹";
  
  if (cart.length === 0) {
    const emptyMsg = lang === "ta" ? "உங்கள் ஷாப்பிங் பேக் காலியாக உள்ளது." : "Your shopping bag is empty.";
    cartList.innerHTML = `<p class="empty-msg">${emptyMsg}</p>`;
  } else {
    cartList.innerHTML = cart.map((i, index) => {
      const title = (lang === "ta" && i.title_ta) ? i.title_ta : i.title;
      return `
      <div class="cart-item">
        <div>
          <strong>${title}</strong>
          <div>${sym}${i.price} × ${i.qty}</div>
        </div>
        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;">✕</button>
      </div>`;
    }).join("");
  }

  updateShippingTotals();
}

function updateShippingTotals() {
  const subtotalEl = document.getElementById("cartSubtotalDisplay");
  const shippingEl = document.getElementById("cartShippingDisplay");
  const totalEl    = document.getElementById("cartTotalDisplay");
  const pinEl      = document.getElementById("custPincode");
  if (!totalEl) return;

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  let shipping = 0, zoneName = "";

  if (subtotal >= FREE_SHIPPING_ABOVE) {
    shipping = 0; zoneName = "Free";
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

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}
/* [END CART] */


/* ═══════════════════════════════════════════════════════════════ */
/* [LISTENERS] Wire up all UI events                               */
/* ═══════════════════════════════════════════════════════════════ */
function setupListeners() {
  // Cart drawers

  document.getElementById("cartOpenBtn").onclick  = () => document.getElementById("cartOverlay").classList.add("open");
  document.getElementById("cartCloseBtn").onclick = () => document.getElementById("cartOverlay").classList.remove("open");


  // Filter chips
  document.querySelectorAll(".filter-chip").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeTag = btn.dataset.tag;
      renderFiltered();
    };
  });

  // Category pills
  document.querySelectorAll(".cat-pill").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".cat-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCat = btn.dataset.cat;
      activeSubCat = "all"; // Reset subcat
      renderSubcategories();
      renderFiltered();
    };
  });

  // Checkout
  document.getElementById("checkoutBtn").onclick = () => {
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

    if (save) {
      saveCustomerDetails({ name, phone, house, area, district, state, pincode: pincode.trim() });
    }

    const fullAddr = `${house}, ${area}, ${district}, ${state} - ${pincode}`.trim();
    const totals = updateShippingTotals();
    const orderId = "AJ-" + Math.floor(1000 + Math.random() * 9000);

    pendingOrder = {
      orderId, name, phone,
      addr: fullAddr,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.grand,
      zone: totals.zoneName,
      items: [...cart]
    };
    triggerWhatsApp(pendingOrder);
  };
}
/* [END LISTENERS] */


/* ═══════════════════════════════════════════════════════════════ */
/* [UPI] Payment modal                                             */
/* ═══════════════════════════════════════════════════════════════ */

/* [END UPI] */


/* ═══════════════════════════════════════════════════════════════ */
/* [WHATSAPP] Order confirmation                                   */
/* ═══════════════════════════════════════════════════════════════ */
function openFavsModal() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarBackdrop").classList.remove("open");
  showItemsModal("moms_choice_favs", "My Favorites");
}

function openWishModal() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarBackdrop").classList.remove("open");
  showItemsModal("moms_choice_wish", "My Wishlist");
}

function showItemsModal(storageKey, title) {
  const modal = document.getElementById("favsModal");
  const list = document.getElementById("favsModalList");
  const titleEl = document.getElementById("favsModalTitle");
  
  titleEl.innerText = title;
  const savedIds = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  const sym = typeof getCurrency === 'function' ? getCurrency() : "₹";
  
  if (savedIds.length === 0) {
    list.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px 0;">No items added yet.</p>`;
  } else {
    // Match IDs to the full product list
    const savedProducts = products.filter(p => savedIds.includes(p.id));
    
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
  
  modal.classList.add("open");
}

function shareStore() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarBackdrop").classList.remove("open");
  
  const url = window.location.href.split('?')[0];
  if (navigator.share) {
    navigator.share({
      title: 'Check out Mom\'s Choice!',
      text: 'Premium sarees, jewelry, and ethnic wear.',
      url: url
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(url);
    alert("Store link copied to clipboard!\n" + url);
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
  
  // Update product page buttons if on that page
  const pdFavBtn = document.getElementById("pdFavBtn");
  if (pdFavBtn && id === currentProduct?.id) {
    pdFavBtn.classList.toggle("active", favs.includes(id));
  }
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
              `---------------------------------\n` +
              `${itemList}\n` +
              `---------------------------------\n` +
              `🧾 Subtotal: ₹${order.subtotal}\n` +
              `${shipLine}\n` +
              `💰 *Grand Total: ₹${order.total}*\n` +
              `💳 *Payment:* UPI (${CONFIG.upiId})\n\n` +
              `📍 *Delivery:*\n` +
              `Name: ${order.name}\n` +
              `Phone: ${order.phone}\n` +
              `Address: ${order.addr}\n\n` +
              `✅ *Attaching payment screenshot below.*`;

  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  document.getElementById("upiModal").classList.remove("open");
  cart = [];
  updateCartUI();
}
/* [END WHATSAPP] */