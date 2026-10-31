// ═══════════════════════════════════════════════════════════════
// 🌟 SITE CONFIGURATION - EDIT ALL LINKS AND LOGO HERE 🌟
// ═══════════════════════════════════════════════════════════════

// 1. LOGO URL (Paste your new Cloudinary logo link here)
const STORE_LOGO_URL = "https://res.cloudinary.com/ft8zlz5x/image/upload/v1793237123/moms_pick/logo/MOMS%20CHOICE.png";

// 2. SOCIAL MEDIA LINKS (Paste your actual links here)
const SOCIAL_LINKS = {
  whatsapp: "https://wa.me/919876543210", // Change to your real number (91 + 10 digits)
  instagram: "https://www.instagram.com/momschoiceoffl/",
  facebook: "https://www.facebook.com/momschoiceoffl/",
  youtube: "https://www.youtube.com/@momschoiceoffl",
  meesho: "https://www.meesho.com/momschoiceoffl",
  email: "mailto:support@momschoice.com" // Change to your real email
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
