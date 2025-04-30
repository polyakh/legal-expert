// scripts/initMobileMenu.js

// ── Configuration Constants ───────────────────────────────────────────────
const MENU_TOGGLE_ID = "mobile-menu";
const MOBILE_NAV_ID = "mobile-nav";
const MOBILE_MEDIA_QUERY = "(max-width: 768px)";
const DEBOUNCE_DELAY = 200; // ms for resize debounce
const ESC_KEY = "Escape"; // keyboard key to close menu

// ── Module-scope State ────────────────────────────────────────────────────
let isMenuInitialized = false;
let resizeListener = null;
let outsideClickListener = null;
let escKeyListener = null;

/**
 * Simple debounce helper
 * @param {Function} fn
 * @param {number} delay
 */
function debounce(fn, delay = DEBOUNCE_DELAY) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function initMobileMenu() {
  const toggleButton = document.getElementById(MENU_TOGGLE_ID);
  const mobileNav = document.getElementById(MOBILE_NAV_ID);

  if (!toggleButton || !mobileNav) {
    console.warn("⚠️ Mobile menu elements not found.");
    return;
  }

  // Avoid double-initialization
  if (isMenuInitialized) return;

  // ── Event Handlers ─────────────────────────────────────────────────────
  function openMenu() {
    mobileNav.hidden = false;
    toggleButton.setAttribute("aria-expanded", "true");
    mobileNav.setAttribute("aria-expanded", "true");
    mobileNav.querySelector("a")?.focus();

    document.addEventListener("click", outsideClickListener);
    document.addEventListener("keydown", escKeyListener);
  }

  function closeMenu() {
    mobileNav.hidden = true;
    toggleButton.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-expanded", "false");
    toggleButton.focus();

    document.removeEventListener("click", outsideClickListener);
    document.removeEventListener("keydown", escKeyListener);
  }

  function handleToggle() {
    const isOpen = toggleButton.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  }

  outsideClickListener = (e) => {
    if (!mobileNav.contains(e.target) && !toggleButton.contains(e.target)) {
      closeMenu();
    }
  };

  escKeyListener = (e) => {
    if (e.key === ESC_KEY) closeMenu();
  };

  // ── Setup / Teardown ───────────────────────────────────────────────────
  const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

  function setupMobileMenu() {
    const isMobile = mediaQuery.matches;

    if (isMobile) {
      toggleButton.addEventListener("click", handleToggle);
      mobileNav.hidden = true;
      toggleButton.setAttribute("aria-expanded", "false");
      mobileNav.setAttribute("aria-expanded", "false");
      isMenuInitialized = true;
    } else if (isMenuInitialized) {
      toggleButton.removeEventListener("click", handleToggle);
      closeMenu();
      isMenuInitialized = false;
    }
  }

  // Initial initialize if on mobile
  setupMobileMenu();

  // Re-check on window resize (debounced)
  resizeListener = debounce(setupMobileMenu);
  window.addEventListener("resize", resizeListener);

  // Clean up on page unload
  window.addEventListener("beforeunload", () => {
    window.removeEventListener("resize", resizeListener);
    if (isMenuInitialized) {
      toggleButton.removeEventListener("click", handleToggle);
      document.removeEventListener("click", outsideClickListener);
      document.removeEventListener("keydown", escKeyListener);
    }
  });
}
