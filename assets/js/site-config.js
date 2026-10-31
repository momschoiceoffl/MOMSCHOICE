// ═══════════════════════════════════════════════════════════════
// 🌟 SITE CONFIGURATION - EDIT ALL LINKS AND LOGO HERE 🌟
// ═══════════════════════════════════════════════════════════════

// 1. LOGO URL (Paste your new Cloudinary logo link here)
const STORE_LOGO_URL = "https://res.cloudinary.com/ft8zlz5x/image/upload/v1793448265/moms_pick/logo/MOMSCHOICE.png";

// 2. SOCIAL MEDIA LINKS
const SOCIAL_LINKS = {
  whatsapp: "https://wa.me/919489938290", 
  instagram: "https://www.instagram.com/moms.choice26/",
  facebook: "https://www.facebook.com/share/1CwQodBTiu/",
  youtube: "https://youtube.com/@momschoice-26",
  meesho: "#", // Update this when you have a Meesho link
  email: "mailto:support@momschoice.com" // Update this when you have a real email
};

// ─────────────────────────────────────────────
// This script automatically updates the website
// with the links above when the page loads.
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Update Logo
  const logoImg = document.querySelector(".brand-logo");
  if (logoImg && STORE_LOGO_URL) {
    logoImg.src = STORE_LOGO_URL;
  }

  // Update Social Links
  document.querySelectorAll(".social-icon").forEach(link => {
    const platform = link.getAttribute("data-social");
    if (platform && SOCIAL_LINKS[platform]) {
      link.href = SOCIAL_LINKS[platform];
      // If it's a web link (not mailto), ensure it opens in a new tab
      if (SOCIAL_LINKS[platform].startsWith("http")) {
        link.target = "_blank";
      }
    }
  });
});
