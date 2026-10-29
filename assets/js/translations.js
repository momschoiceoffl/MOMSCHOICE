// ═══════════════════════════════════════════════════════════════
// MOM'S PICK — Tamil & English Translations
// ═══════════════════════════════════════════════════════════════
const TRANSLATIONS = {
  en: {
    store_name: "Mom's Choice",
    home: "Home",
    categories: "Categories",
    favorites: "Favorites",
    wishlist: "Wishlist",
    share_store: "Share Store",
    search_placeholder: "Search products...",
    search_cat_placeholder: "Search this category...",
    login: "Login",
    shop_by_category: "Shop by Category",
    you_may_also_like: "You may also like",
    
    shopping_bag: "Your Shopping Bag",
    empty_bag: "Your shopping bag is empty.",
    subtotal: "Subtotal",
    shipping: "Shipping",
    grand_total: "Grand Total",
    checkout_wa: "📲 Send Order on WhatsApp",
    add_to_cart: "Add to Cart",
    send_wa: "Send Order on WhatsApp",
    proceed_pay: "Proceed to Pay & WhatsApp Order",
    
    full_name: "Full Name",
    phone: "WhatsApp Number",
    house: "Flat / House No / Street",
    area: "Area / Locality",
    district: "District",
    state: "State",
    pincode: "Pincode (6 digits)",
    save_details: "Save details for next order",
    address: "Full Delivery Address with Pincode",
    product_enquiry: "Product Enquiry",
    back: "← Back",
    remove: "Remove"
  },
  ta: {
    store_name: "மாம்ஸ் சாய்ஸ்",
    home: "முகப்பு",
    categories: "வகைகள்",
    favorites: "பிடித்தவை",
    wishlist: "விருப்பப் பட்டியல்",
    share_store: "ஸ்டோரை பகிர்",
    search_placeholder: "தேடு...",
    search_cat_placeholder: "இந்த வகையில் தேடு...",
    login: "உள்நுழை",
    shop_by_category: "வகை வாரியாக வாங்க",
    you_may_also_like: "இவையும் உங்களுக்கு பிடிக்கலாம்",
    
    shopping_bag: "உங்கள் ஷாப்பிங் பேக்",
    empty_bag: "உங்கள் ஷாப்பிங் பேக் காலியாக உள்ளது.",
    subtotal: "மொத்தம்",
    shipping: "டெலிவரி கட்டணம்",
    grand_total: "மொத்த விலை",
    checkout_wa: "📲 வாட்ஸ்அப்பில் ஆர்டர் செய்",
    add_to_cart: "கார்ட்டில் சேர்",
    send_wa: "வாட்ஸ்அப்பில் அனுப்பு",
    proceed_pay: "பணம் செலுத்தி ஆர்டர் செய்",
    
    full_name: "முழு பெயர்",
    phone: "வாட்ஸ்அப் எண்",
    house: "வீட்டு எண் / தெரு",
    area: "பகுதி / ஊர்",
    district: "மாவட்டம்",
    state: "மாநிலம்",
    pincode: "அஞ்சல் குறியீடு",
    save_details: "அடுத்த ஆர்டருக்கு விவரங்களை சேமி",
    address: "முழு டெலிவரி முகவரி",
    product_enquiry: "பொருள் விசாரணை",
    back: "← பின்செல்",
    remove: "நீக்கு",
    
    // Category Dictionary
    cat_sarees: "புடவைகள்",
    cat_necklaces: "நெக்லஸ்கள்",
    cat_earrings: "காதணிகள்",
    cat_bangles: "வளையல்கள்",
    cat_rings: "மோதிரங்கள்",
    cat_ornaments: "அலங்காரங்கள்",
    cat_accessories: "பாகங்கள்",
    sub_silk: "பட்டு",
    sub_cotton: "பருத்தி",
    sub_designer: "டிசைனர்",
    sub_choker: "சோக்கர்",
    sub_jhumka: "ஜிமிக்கி"
  }
};

function t(key) {
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ? TRANSLATIONS[lang][key] : key;
}

function translateCategory(cat) {
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  if (lang !== "ta") return cat;
  const map = {
    "Sarees": "புடவைகள்", "Necklaces": "நெக்லஸ்கள்", "Earrings": "காதணிகள்",
    "Bangles": "வளையல்கள்", "Rings": "மோதிரங்கள்", "Ornaments": "அலங்காரங்கள்",
    "Accessories": "பாகங்கள்", "Silk": "பட்டு", "Cotton": "பருத்தி", "Designer": "டிசைனர்", "Polyester": "பாலிஎஸ்டர்"
  };
  return map[cat] || cat;
}

function getCurrency() {
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  return lang === "ta" ? "ரூ" : "₹";
}

function setLanguage(lang) {
  // 1. Set the language in localStorage FIRST
  localStorage.setItem("moms_pick_lang", lang);
  document.documentElement.lang = lang;
  
  // 2. Update static HTML elements
  applyTranslations();

  // 3. Re-render all dynamic content using the NEW language
  // Home Page
  if (typeof renderFiltered === 'function') renderFiltered(); 
  if (typeof renderCategoryCards === 'function') renderCategoryCards(); 
  
  // Update Carousel text WITHOUT resetting position
  if (typeof updateCarouselText === 'function') {
    updateCarouselText();
  } else if (typeof initCarousel === 'function') {
    initCarousel(); // Fallback if the update function doesn't exist yet
  }

  // Category Page
  if (typeof renderSubcategories === 'function') renderSubcategories(); 
  if (typeof renderProducts === 'function') renderProducts(); 
  
  // Product Page
  if (typeof renderProduct === 'function') renderProduct();   
  if (typeof renderAlsoLike === 'function') renderAlsoLike(); 

  // Cart Drawer (on all pages)
  if (typeof updateCartUI === 'function') updateCartUI();

}



function applyTranslations() {
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  const dict = TRANSLATIONS[lang];
  if (!dict) return;

  // Close the sidebar menu categories if it's open to force a re-render
  const subnav = document.getElementById("sidebarSubnav");
  if (subnav) subnav.style.display = "none";

  // Translate all elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
        el.placeholder = dict[key];
      } else if (el.tagName === "TEXTAREA" && el.hasAttribute("placeholder")) {
        el.placeholder = dict[key];
      } else {
        el.innerText = dict[key];
      }
    }
  });

  // Also translate the search bar placeholder on Category page
  const catSearchInput = document.getElementById("searchInput");
  if (catSearchInput && catSearchInput.hasAttribute("data-i18n")) {
    catSearchInput.placeholder = dict[catSearchInput.getAttribute("data-i18n")] || catSearchInput.placeholder;
  }

  // Update the "← Home" back button text
  const backBtn = document.getElementById("catBackBtn");
  if (backBtn) {
    backBtn.innerText = lang === "ta" ? "← முகப்பு" : "← Home";
  }

  // Update the Category Page Title (Sarees -> புடவைகள்)
  const titleEl = document.getElementById("catPageTitle");
  if (titleEl) {
    const urlCat = new URLSearchParams(location.search).get("cat") || "all";
    const catMap = {
      "Sarees": "புடவைகள்", "Necklaces": "நெக்லஸ்கள்", "Earrings": "காதணிகள்",
      "Bangles": "வளையல்கள்", "Rings": "மோதிரங்கள்", "Ornaments": "அலங்காரங்கள்",
      "Accessories": "பாகங்கள்"
    };
    let newTitle;
    if (urlCat === "all") {
      newTitle = lang === "ta" ? "அனைத்து பொருட்கள்" : "All Products";
    } else {
      newTitle = (lang === "ta" && catMap[urlCat]) ? catMap[urlCat] : urlCat;
    }
    titleEl.innerText = newTitle;
    document.title = newTitle + " | Mom's Choice";
  }

  const btnEn = document.getElementById("btnLangEn");
  const btnTa = document.getElementById("btnLangTa");
  
  if (btnEn && btnTa) {
    if (lang === "ta") {
      btnTa.style.background = "#F1F0E2";
      btnTa.style.color = "#14050B";
      btnEn.style.background = "transparent";
      btnEn.style.color = "var(--text-muted)";
    } else {
      btnEn.style.background = "#F1F0E2";
      btnEn.style.color = "#14050B";
      btnTa.style.background = "transparent";
      btnTa.style.color = "var(--text-muted)";
    }
  }
}

function toggleSidebarCategories(e) {
  if (e) e.preventDefault();
  
  const subnav = document.getElementById("sidebarSubnav");
  if (!subnav) return;
  
  // If already open, close it
  if (subnav.style.display === "block") {
    subnav.style.display = "none";
    return;
  }
  
  // If storeCategories isn't loaded yet, fallback to products list
  if (typeof storeCategories === 'undefined' || Object.keys(storeCategories).length === 0) {
    if (typeof products !== 'undefined' && products.length > 0) {
      // Build fallback categories from products
      let fallbackCats = {};
      products.forEach(p => {
        if (!fallbackCats[p.category]) fallbackCats[p.category] = [];
        if (p.subcategory && !fallbackCats[p.category].includes(p.subcategory)) {
          fallbackCats[p.category].push(p.subcategory);
        }
      });
      window.storeCategories = fallbackCats;
    }
  }

  let html = "";
  
  // Build the Categories -> Subcategories drill down
  if (typeof storeCategories !== 'undefined' && storeCategories) {
    for (const cat in storeCategories) {
      if (cat === "_translations") continue;
      
      // Only show categories that have at least 1 product
      if (typeof products !== 'undefined' && products.filter(p => p.category === cat).length === 0) {
        continue;
      }
      
      const catName = typeof translateCategory === 'function' ? translateCategory(cat) : cat;
      const safeCatId = cat.replace(/\s+/g, '_');
      
      // 1. Main Category Link (Acts as a toggle)
      html += `<a href="#" class="sidebar-sublink" onclick="event.preventDefault(); const el = document.getElementById('subcat-${safeCatId}'); if(el) el.style.display = el.style.display === 'none' ? 'flex' : 'none';" style="font-weight:bold; color:var(--gold-glow); display:block; padding: 8px 16px;">${catName}</a>`;
      
      // 2. Subcategories (Hidden by default)
      const subs = storeCategories[cat];
      if (subs && subs.length > 0) {
        html += `<div id="subcat-${safeCatId}" style="padding-left: 16px; display: none; flex-direction: column;">`;
        
        // Add an "All [Category]" link just in case
        const allTxt = localStorage.getItem("moms_pick_lang") === "ta" ? "அனைத்தும்" : "All";
        html += `<a href="category.html?cat=${encodeURIComponent(cat)}" class="sidebar-sublink" style="font-size:0.8rem; color:var(--text-muted); display:block; padding: 4px 16px; font-style:italic;">↳ ${allTxt}</a>`;
        
        subs.forEach(sub => {
          const subName = typeof translateCategory === 'function' ? translateCategory(sub) : sub;
          html += `<a href="category.html?cat=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}" class="sidebar-sublink" style="font-size:0.8rem; color:var(--text-muted); display:block; padding: 4px 16px;">↳ ${subName}</a>`;
        });
        html += `</div>`;
      }
    }
  }
  
  subnav.innerHTML = html;
  subnav.style.display = "block";
}

document.addEventListener("DOMContentLoaded", applyTranslations);
