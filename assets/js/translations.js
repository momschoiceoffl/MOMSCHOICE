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
    remove: "Remove",
    my_favorites: "My Favorites",
    my_wishlist: "My Wishlist",
    follow_us: "Follow Us On",
    all_rights: "All Rights Reserved.",
    terms_policies: "Terms & Policies",
    policy_warning: "No Returns • No Refunds • Online Payment Only • No COD",
    pol_title: "Terms, Shipping & Returns",
    pol_sub: "Please read our store policies carefully before making a purchase.",
    pol_s1_t: "1. Shipping Policy",
    pol_s1_p: "We ship across India through trusted courier partners.",
    pol_s1_l1: "Dispatch Time: Orders are dispatched within 24 to 48 hours (not exceeding 2 business days).",
    pol_s1_l2: "Delivery Time: Delivery usually takes up to 7 working days based on transportation. However, it may extend up to 15 days for remote locations or unforeseen transit delays.",
    pol_s1_l3: "Shipping Charges: Free for orders above ₹2000. Below ₹2000, a flat rate of ₹60–₹150 applies based on your pincode zone.",
    pol_s1_l4: "Tracking: A WhatsApp tracking link will be sent to you within 24 hours of dispatch.",
    pol_s2_t: "2. Return, Exchange & Cancellation Policy",
    pol_s2_p: "ALL SALES ARE FINAL. We strictly do not accept returns, exchanges, or cancellations under any circumstances.",
    pol_s2_l1: "No Cancellations: Orders cannot be cancelled once placed. Please double-check your cart before checking out.",
    pol_s2_l2: "No Returns or Exchanges: We do not accept returns or exchanges for size issues, change of mind, or colour variations.",
    pol_s2_l3: "Damage Claims: In the extremely rare case of a damaged or wrong item, you must record a clear parcel opening video and send it to us on WhatsApp within 24 hours of delivery. Claims without a video will be rejected. If approved, we will offer a replacement (subject to stock availability) or store credit. No cash refunds will be provided.",
    pol_s3_t: "3. Refund Policy",
    pol_s3_p: "We do not offer cash refunds.",
    pol_s3_l1: "If an order is cancelled by us due to stock unavailability, a full refund will be processed to your original payment method within 5–7 business days.",
    pol_s3_l2: "Approved damage claims (with video proof) will be resolved via a replacement or store credit only.",
    pol_s4_t: "4. Payment Policy (Manual WhatsApp Checkout)",
    pol_s4_p: "We operate on a WhatsApp-first enquiry model to ensure personal service and order accuracy.",
    pol_s4_l1: "How it works: 1. You send an enquiry via our WhatsApp button. 2. We confirm product availability, final price, and shipping cost through a WhatsApp conversation. 3. Once confirmed, we share our UPI ID or UPI QR code directly on WhatsApp. 4. You complete the payment and send a screenshot of the payment confirmation back to us on WhatsApp. 5. Order is processed only after we receive and verify your payment screenshot.",
    pol_s4_l2: "Accepted Payment Methods: UPI transfer (Google Pay, PhonePe, Paytm, or any UPI app) or direct bank transfer via the UPI ID shared on WhatsApp.",
    pol_s4_l3: "Not Available: We do NOT offer Cash on Delivery (COD). We do NOT accept credit cards, debit cards, net banking, or any third-party payment gateway. All payments are direct UPI transfers only.",
    pol_s4_l4: "Order Processing: Orders are processed only after we have received your payment screenshot and verified the transaction. We will send you a dispatch confirmation on WhatsApp.",
    pol_s4_l5: "Security: We never ask for OTPs, UPI PINs, or card details. If anyone claims to be us and asks for these, please report immediately.",
    pol_s5_t: "5. Privacy Policy",
    pol_s5_l1: "We collect: Name, phone, delivery address, pincode, email (optional), order history, and payment screenshot references.",
    pol_s5_l2: "We use this for: Order fulfilment, delivery, customer support, and order status updates via WhatsApp.",
    pol_s5_l3: "We do NOT: Sell your data, share it with third-party marketers, or store your UPI PIN/bank credentials.",
    pol_s6_t: "6. Terms & Conditions",
    pol_s6_l1: "All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order.",
    pol_s6_l2: "Colour Disclaimer: Product colours may vary slightly due to photography, lighting, and screen settings. This is not considered a defect.",
    pol_s6_l3: "All product images and store branding are our intellectual property.",
    pol_s6_l4: "These terms are governed by the laws of India.",
    pol_s7_t: "7. Disclaimer",
    pol_s7_l1: "All our products are handpicked and may be handcrafted. Slight irregularities in weave, print, or embroidery are characteristic of handmade products and are not defects.",
    pol_s7_l2: "Unless explicitly mentioned, sarees come with an unstitched blouse piece. Stitching is not included.",
    pol_s7_l3: "We recommend dry cleaning for silk and hand-wash in cold water for cotton/polyester.",
    pol_s8_t: "8. Contact / Customer Support",
    pol_s8_l1: "WhatsApp (fastest): +91 98765 43210 (replies within 2–4 hours)",
    pol_s8_l2: "Email: support@momschoice.com",
    pol_s8_l3: "Business hours: Monday to Saturday, 10 AM to 8 PM IST. Sunday closed."
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
    my_favorites: "எனது பிடித்தவை",
    my_wishlist: "எனது விருப்பப் பட்டியல்",
    follow_us: "எங்களை பின்தொடரவும்",
    all_rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    terms_policies: "விதிமுறைகள் & கொள்கைகள்",
    policy_warning: "திரும்பப் பெற முடியாது • பணம் திரும்பத் தரப்படாது • ஆன்லைன் பேமெண்ட் மட்டும் • COD இல்லை",
    pol_title: "விதிமுறைகள், ஷிப்பிங் & திரும்பப் பெறுதல்",
    pol_sub: "வாங்குவதற்கு முன் எங்கள் கொள்கைகளை கவனமாக படிக்கவும்.",
    pol_s1_t: "1. ஷிப்பிங் கொள்கை",
    pol_s1_p: "நம்பகமான கூரியர் மூலம் இந்தியா முழுவதும் அனுப்புகிறோம்.",
    pol_s1_l1: "அனுப்பும் நேரம்: ஆர்டர்கள் 24 முதல் 48 மணி நேரத்திற்குள் அனுப்பப்படும் (2 வேலை நாட்களுக்கு மேல் ஆகாது).",
    pol_s1_l2: "டெலிவரி நேரம்: போக்குவரத்தை பொறுத்து 7 வேலை நாட்கள் ஆகும். தொலைதூர இடங்கள் அல்லது தாமதங்களுக்கு 15 நாட்கள் வரை ஆகலாம்.",
    pol_s1_l3: "ஷிப்பிங் கட்டணம்: ₹2000க்கு மேல் இலவசம். ₹2000க்கு கீழ், பின்கோட் பகுதியை பொறுத்து ₹60–₹150 வசூலிக்கப்படும்.",
    pol_s1_l4: "டிராக்கிங்: அனுப்பிய 24 மணி நேரத்திற்குள் வாட்ஸ்அப்பில் டிராக்கிங் லிங்க் அனுப்பப்படும்.",
    pol_s2_t: "2. திரும்பப் பெறுதல், மாற்றுதல் & ரத்து கொள்கை",
    pol_s2_p: "அனைத்து விற்பனையும் இறுதியானது. எந்த சூழ்நிலையிலும் திரும்பப் பெறுதல், மாற்றுதல் அல்லது ரத்து செய்வதை நாங்கள் ஏற்கமாட்டோம்.",
    pol_s2_l1: "ரத்து இல்லை: ஆர்டர் செய்த பிறகு ரத்து செய்ய முடியாது. செக் அவுட் செய்வதற்கு முன் உங்கள் கார்ட்டை சரிபார்க்கவும்.",
    pol_s2_l2: "திரும்பப் பெறுதல் இல்லை: அளவு, மனமாற்றம் அல்லது நிற வேறுபாடுகளுக்கு திரும்பப் பெறுதல் ஏற்கப்படாது.",
    pol_s2_l3: "சேதம் புகார்: அரிதான சூழ்நிலையில் சேதமடைந்த பொருள் வந்தால், பார்சல் திறக்கும் வீடியோவை பதிவு செய்து 24 மணி நேரத்திற்குள் வாட்ஸ்அப்பில் அனுப்பவும். வீடியோ இல்லாமல் புகார் ஏற்கப்படாது.",
    pol_s3_t: "3. பணம் திரும்பத் தரும் கொள்கை",
    pol_s3_p: "நாங்கள் பணம் திரும்பத் தருவதில்லை.",
    pol_s3_l1: "இருப்பு இல்லாத காரணத்தால் நாங்கள் ரத்து செய்தால், 5-7 வேலை நாட்களில் பணம் திரும்பத் தரப்படும்.",
    pol_s3_l2: "அங்கீகரிக்கப்பட்ட சேத புகார்கள் (வீடியோ ஆதாரத்துடன்) மாற்று பொருள் அல்லது ஸ்டோர் கிரெடிட் மூலம் தீர்க்கப்படும்.",
    pol_s4_t: "4. பேமெண்ட் கொள்கை (வாட்ஸ்அப் செக் அவுட்)",
    pol_s4_p: "தனிப்பட்ட சேவை மற்றும் துல்லியத்திற்காக வாட்ஸ்அப் முதல் விசாரணை முறையில் செயல்படுகிறோம்.",
    pol_s4_l1: "இது எப்படி வேலை செய்கிறது: 1. வாட்ஸ்அப் மூலம் விசாரணை அனுப்பவும். 2. தயாரிப்பு இருப்பு, விலை மற்றும் ஷிப்பிங் கட்டணத்தை உறுதிப்படுத்துவோம். 3. உறுதிப்படுத்திய பிறகு UPI ID அல்லது QR குறியீட்டை வாட்ஸ்அப்பில் பகிர்வோம். 4. பணம் செலுத்தி ஸ்கிரீன்ஷாட்டை வாட்ஸ்அப்பில் அனுப்பவும். 5. ஸ்கிரீன்ஷாட்டை சரிபார்த்த பிறகே ஆர்டர் செயல்படுத்தப்படும்.",
    pol_s4_l2: "ஏற்கப்படும் பேமெண்ட் முறைகள்: UPI டிரான்ஸ்ஃபர் (Google Pay, PhonePe, Paytm) அல்லது வாட்ஸ்அப்பில் பகிரப்பட்ட UPI ID மூலம் வங்கி பணப் பரிமாற்றம்.",
    pol_s4_l3: "கிடையாது: COD இல்லை. கிரெடிட் கார்டு, டெபிட் கார்டு, நெட் பேங்கிங் ஏற்கப்படாது. நேரடி UPI பணப் பரிமாற்றம் மட்டுமே.",
    pol_s4_l4: "ஆர்டர் செயலாக்கம்: பேமெண்ட் ஸ்கிரீன்ஷாட்டை சரிபார்த்த பிறகே ஆர்டர் செயல்படுத்தப்படும். வாட்ஸ்அப்பில் டிஸ்பேட்ச் உறுதிப்படுத்தல் அனுப்புவோம்.",
    pol_s4_l5: "பாதுகாப்பு: OTP, UPI PIN அல்லது கார்டு விவரங்களை நாங்கள் ஒருபோதும் கேட்க மாட்டோம்.",
    pol_s5_t: "5. தனியுரிமைக் கொள்கை",
    pol_s5_l1: "நாங்கள் சேகரிப்பவை: பெயர், தொலைபேசி, முகவரி, பின்கோட், மின்னஞ்சல் (விருப்பம்), ஆர்டர் வரலாறு மற்றும் பேமெண்ட் ஸ்கிரீன்ஷாட்.",
    pol_s5_l2: "இதைப் பயன்படுத்துவது: ஆர்டர் நிறைவேற்றம், டெலிவரி, வாடிக்கையாளர் சேவை மற்றும் வாட்ஸ்அப் மூலம் தகவல் அனுப்ப.",
    pol_s5_l3: "நாங்கள் செய்யாதவை: தரவை விற்பது இல்லை, மார்க்கெட்டர்களுடன் பகிர்வது இல்லை, UPI PIN சேமிப்பது இல்லை.",
    pol_s6_t: "6. விதிமுறைகள் & நிபந்தனைகள்",
    pol_s6_l1: "அனைத்து ஆர்டர்களும் இருப்பு மற்றும் ஏற்புக்கு உட்பட்டவை. ஆர்டரை ரத்து செய்யும் உரிமை எங்களுக்கு உண்டு.",
    pol_s6_l2: "நிற வேறுபாடு: புகைப்படம், விளக்குகள் மற்றும் திரை அமைப்புகளால் நிறம் சற்று மாறுபடலாம். இது குறை அல்ல.",
    pol_s6_l3: "அனைத்து படங்களும் பிராண்டும் எங்கள் அறிவுசார் சொத்து.",
    pol_s6_l4: "இந்த விதிமுறைகள் இந்திய சட்டங்களால் நிர்வகிக்கப்படுகின்றன.",
    pol_s7_t: "7. பொறுப்புத் துறப்பு",
    pol_s7_l1: "எங்கள் தயாரிப்புகள் அனைத்தும் கைவினைப் பொருட்கள். சிறிய முறைகேடுகள் குறை அல்ல.",
    pol_s7_l2: "வேறுவிதமாக குறிப்பிடப்படாவிட்டால், புடவைகளுடன் தையல் செய்யப்படாத பிளவுஸ் துணி வரும். தையல் சேவை இல்லை.",
    pol_s7_l3: "பட்டுக்கு ட்ரை க்ளீனிங் மற்றும் பருத்தி/பாலியஸ்டருக்கு குளிர்ந்த நீரில் கழுவ பரிந்துரைக்கிறோம்.",
    pol_s8_t: "8. தொடர்பு / வாடிக்கையாளர் சேவை",
    pol_s8_l1: "வாட்ஸ்அப் (விரைவானது): +91 98765 43210 (2-4 மணி நேரத்தில் பதில்)",
    pol_s8_l2: "மின்னஞ்சல்: support@momschoice.com",
    pol_s8_l3: "வேலை நேரம்: திங்கள் முதல் சனி, காலை 10 - இரவு 8 IST. ஞாயிறு விடுமுறை."
    
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
    "Accessories": "பாகங்கள்", "Silk": "பட்டு", "Cotton": "காட்டன்", "Designer": "டிசைனர்", "Polyester": "பாலிஎஸ்டர்"
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

  // Close sidebar menu if open so it rebuilds in the new language
  const subnav = document.getElementById("sidebarSubnav");
  if (subnav) subnav.style.display = "none";
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
