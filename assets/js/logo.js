// ═══════════════════════════════════════════════════════════════
// CENTRAL LOGO CONFIGURATION
// PASTE YOUR NEW CLOUDINARY LOGO URL INSIDE THE QUOTES BELOW
// ═══════════════════════════════════════════════════════════════
const STORE_LOGO_URL = "https://res.cloudinary.com/ft8zlz5x/image/upload/v1793237123/moms_pick/logo/MOMS%20CHOICE.png";

document.addEventListener("DOMContentLoaded", () => {
  const logoImg = document.querySelector(".brand-logo");
  if (logoImg) {
    logoImg.src = STORE_LOGO_URL;
  }
});
