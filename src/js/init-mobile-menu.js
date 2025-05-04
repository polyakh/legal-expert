// scripts/initMobileMenu.js

// ── Configuration Constants ───────────────────────────────────────────────
const MENU_TOGGLE_ID       = 'mobile-menu';
const MOBILE_NAV_ID        = 'mobile-nav';
const MOBILE_CLOSE_ID      = 'closeNav';
const MOBILE_MEDIA_QUERY   = '(max-width: 768px)';
const DEBOUNCE_DELAY       = 200;  // ms for resize debounce
const CLOSE_DELAY_AFTER_NAV = 250; // delay before closing nav on link click
const ESC_KEY              = 'Escape'; // keyboard key to close menu

// ── Module-scope State ────────────────────────────────────────────────────
let isMenuInitialized     = false;
let resizeListener        = null;
let outsideClickListener  = null;
let escKeyListener        = null;

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
  const mobileNav    = document.getElementById(MOBILE_NAV_ID);
  const closeButton  = document.getElementById(MOBILE_CLOSE_ID);

  if (!toggleButton || !mobileNav || !closeButton) {
    console.warn('⚠️ Required mobile menu elements not found.');
    return;
  }

  if (isMenuInitialized) return;

  function openMenu() {
    mobileNav.hidden = false;
    toggleButton.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-expanded', 'true');
    mobileNav.querySelector('a')?.focus();

    document.addEventListener('click', outsideClickListener);
    document.addEventListener('keydown', escKeyListener);
  }

  function closeMenu() {
    mobileNav.hidden = true;
    toggleButton.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-expanded', 'false');

    document.removeEventListener('click', outsideClickListener);
    document.removeEventListener('keydown', escKeyListener);
  }

  function handleToggle() {
    const isOpen = toggleButton.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  }

  outsideClickListener = e => {
    if (!mobileNav.contains(e.target) && !toggleButton.contains(e.target)) {
      closeMenu();
    }
  };

  escKeyListener = e => {
    if (e.key === ESC_KEY) closeMenu();
  };

  const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

  function setupMobileMenu() {
    const isMobile = mediaQuery.matches;

    if (isMobile) {
      toggleButton.addEventListener('click', handleToggle);
      closeButton.addEventListener('click', closeMenu);
      mobileNav.hidden = true;
      toggleButton.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-expanded', 'false');

      const navLinks = mobileNav.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          setTimeout(closeMenu, CLOSE_DELAY_AFTER_NAV);
        });
      });

      isMenuInitialized = true;
    } else if (isMenuInitialized) {
      toggleButton.removeEventListener('click', handleToggle);
      closeButton.removeEventListener('click', closeMenu);
      closeMenu();
      isMenuInitialized = false;
    }
  }

  setupMobileMenu();
  resizeListener = debounce(setupMobileMenu);
  window.addEventListener('resize', resizeListener);

  window.addEventListener('beforeunload', () => {
    window.removeEventListener('resize', resizeListener);
    if (isMenuInitialized) {
      toggleButton.removeEventListener('click', handleToggle);
      closeButton.removeEventListener('click', closeMenu);
      document.removeEventListener('click', outsideClickListener);
      document.removeEventListener('keydown', escKeyListener);
    }
  });
}