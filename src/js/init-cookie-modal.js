// ─── Constants ─────────────────────────────────────────────
const SELECTORS = {
    showBtn: 'showModal',
    closeBtn: 'closeModal',
    overlay: 'modalOverlay',
    categoryHeaders: '.category-header',
    toggleSwitches: '.toggle-switch input',
    rejectBtn: '.btn-reject',
    acceptBtn: '.btn-accept',
    saveBtn: '.btn-save',
  };
  
  const CLASSNAMES = {
    active: 'active',
    expanded: 'expanded',
  };
  
  const STORAGE_KEY = 'cookiePreferences';
  
  const ANIMATION = {
    closeDelayMs: 300,
  };
  
  // ─── Helpers ───────────────────────────────────────────────
  function getPreferences() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
  
  function savePreferences(preferences) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }
  
  function applyPreferences(preferences) {
    const allToggles = document.querySelectorAll(SELECTORS.toggleSwitches);
    allToggles.forEach(input => {
      const type = input.dataset.type;
      if (preferences[type] !== undefined) {
        input.checked = preferences[type];
      }
    });
  }
  
  // ─── Init Cookie Modal ─────────────────────────────────────
  export function initCookieModal() {
    const showBtn = document.getElementById(SELECTORS.showBtn);
    const closeBtn = document.getElementById(SELECTORS.closeBtn);
    const overlay = document.getElementById(SELECTORS.overlay);
    const categoryHeaders = document.querySelectorAll(SELECTORS.categoryHeaders);
    const rejectBtn = document.querySelector(SELECTORS.rejectBtn);
    const acceptBtn = document.querySelector(SELECTORS.acceptBtn);
    const saveBtn = document.querySelector(SELECTORS.saveBtn);
  
    if (!showBtn || !closeBtn || !overlay) {
      console.warn('⚠️ Cookie modal elements not found.');
      return;
    }
  
    // Restore previous preferences
    const savedPrefs = getPreferences();
    if (savedPrefs) {
      applyPreferences(savedPrefs);
      return; // auto-apply, don't show modal again
    }
  
    const openModal = () => overlay.classList.add(CLASSNAMES.active);
    const closeModal = () => overlay.classList.remove(CLASSNAMES.active);
  
    const readPreferences = () => {
      const prefs = {};
      document.querySelectorAll(SELECTORS.toggleSwitches).forEach(input => {
        const type = input.dataset.type;
        prefs[type] = input.checked;
      });
      return prefs;
    };
  
    // ── Event Listeners ──────────────────────────────────────
    showBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
  
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
  
    categoryHeaders.forEach(header => {
      header.addEventListener('click', e => {
        if (e.target.closest('.toggle-switch')) return;
        header.parentElement.classList.toggle(CLASSNAMES.expanded);
      });
    });
  
    rejectBtn?.addEventListener('click', () => {
      document.querySelectorAll(`${SELECTORS.toggleSwitches}:not([disabled])`).forEach(input => {
        input.checked = false;
      });
      savePreferences(readPreferences());
      setTimeout(closeModal, ANIMATION.closeDelayMs);
    });
  
    acceptBtn?.addEventListener('click', () => {
      document.querySelectorAll(SELECTORS.toggleSwitches).forEach(input => {
        input.checked = true;
      });
      savePreferences(readPreferences());
      setTimeout(closeModal, ANIMATION.closeDelayMs);
    });
  
    saveBtn?.addEventListener('click', () => {
      savePreferences(readPreferences());
      closeModal();
    });
  }