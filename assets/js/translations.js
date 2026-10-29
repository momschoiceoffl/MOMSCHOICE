// ═══════════════════════════════════════════════════════════════
// MOM'S PICK — Tamil & English Translations
// ═══════════════════════════════════════════════════════════════
const TRANSLATIONS = {
  en: {
    store_name: "Mom's Pick",
    home: "Home",
    categories: "Categories",
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
    store_name: "மாம்ஸ் பிக்",
    home: "முகப்பு",
    categories: "வகைகள்",
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
    "Accessories": "பாகங்கள்", "Silk": "பட்டு", "Cotton": "பருத்தி", "Designer": "டிசைனர்"
  };
  return map[cat] || cat;
}

function getCurrency() {
  const lang = localStorage.getItem("moms_pick_lang") || "en";
  return lang === "ta" ? "ரூ" : "₹";
}

function setLanguage(lang) {
  localStorage.setItem("moms_pick_lang", lang);
  document.documentElement.lang = lang;
  applyTranslations();
  
  // Refresh dynamic content
  if (typeof renderFiltered === 'function') renderFiltered();
  if (typeof renderProducts === 'function') renderProducts();
  if (typeof renderCategoryCards === 'function') renderCategoryCards();
  if (typeof initCarousel === 'function') initCarousel();
  if (typeof renderSubcategories === 'function') renderSubcategories();
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

  const btn = document.getElementById("langToggleBtn");
  if (btn) btn.innerText = lang === "en" ? "த / EN" : "EN / த";
}

document.addEventListener("DOMContentLoaded", applyTranslations);
