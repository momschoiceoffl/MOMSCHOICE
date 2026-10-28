// ═══════════════════════════════════════════════════════════════
// MOM'S PICK — Tamil & English Translations
// ═══════════════════════════════════════════════════════════════
const TRANSLATIONS = {
  en: {
    // Header & Navigation
    home: "Home",
    categories: "Categories",
    search_placeholder: "Search products...",
    search_cat_placeholder: "Search this category...",
    login: "Login",
    
    // Cart & Checkout
    shopping_bag: "Your Shopping Bag",
    empty_bag: "Your shopping bag is empty.",
    subtotal: "Subtotal",
    shipping: "Shipping",
    grand_total: "Grand Total",
    checkout_wa: "📲 Send Order on WhatsApp",
    add_to_cart: "Add to Cart",
    send_wa: "Send Order on WhatsApp",
    
    // Form Fields
    full_name: "Full Name",
    phone: "WhatsApp Number",
    house: "Flat / House No / Street",
    area: "Area / Locality",
    district: "District",
    state: "State",
    pincode: "Pincode (6 digits)",
    save_details: "Save details for next order"
  },
  ta: {
    // Header & Navigation
    home: "முகப்பு",
    categories: "வகைகள்",
    search_placeholder: "தேடு...",
    search_cat_placeholder: "இந்த வகையில் தேடு...",
    login: "உள்நுழை",
    
    // Cart & Checkout
    shopping_bag: "உங்கள் ஷாப்பிங் பேக்",
    empty_bag: "உங்கள் ஷாப்பிங் பேக் காலியாக உள்ளது.",
    subtotal: "மொத்தம்",
    shipping: "டெலிவரி கட்டணம்",
    grand_total: "மொத்த விலை",
    checkout_wa: "📲 வாட்ஸ்அப்பில் ஆர்டர் செய்",
    add_to_cart: "கார்ட்டில் சேர்",
    send_wa: "வாட்ஸ்அப்பில் அனுப்பு",
    
    // Form Fields
    full_name: "முழு பெயர்",
    phone: "வாட்ஸ்அப் எண்",
    house: "வீட்டு எண் / தெரு",
    area: "பகுதி / ஊர்",
    district: "மாவட்டம்",
    state: "மாநிலம்",
    pincode: "அஞ்சல் குறியீடு",
    save_details: "அடுத்த ஆர்டருக்கு விவரங்களை சேமி"
  }
};

function setLanguage(lang) {
  localStorage.setItem("moms_pick_lang", lang);
  document.documentElement.lang = lang;
  applyTranslations();
}

function toggleLanguage() {
  const current = localStorage.getItem("moms_pick_lang") || "en";
  const next = current === "en" ? "ta" : "en";
  setLanguage(next);
}

function applyTranslations() {
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  const dict = TRANSLATIONS[lang];
  if (!dict) return;

  // Update elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
        el.placeholder = dict[key];
      } else {
        el.innerText = dict[key];
      }
    }
  });

  // Update Toggle Button Text
  const btn = document.getElementById("langToggleBtn");
  if (btn) btn.innerText = lang === "en" ? "த / EN" : "EN / த";
}

// Apply immediately on load
document.addEventListener("DOMContentLoaded", applyTranslations);
