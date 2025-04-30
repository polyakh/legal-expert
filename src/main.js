import { loadCsrfToken } from "./js/csrf-service.js";
import { attachContactHandler } from "./attach-contact-handler.js";
import { initMobileMenu } from "./js/init-mobile-menu.js";
import { initCookieModal } from "./js/init-cookie-modal.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize mobile menu
  initMobileMenu();

  initCookieModal()
  const form = document.getElementById("contact-form");
  const tokenField = document.getElementById("csrfToken");

  if (!form || !tokenField) {
    console.warn("⚠️ Form or CSRF token input not found — skipping init");
    return;
  }

  try {
    await loadCsrfToken("#csrfToken");
    attachContactHandler(form, tokenField.value); // no need to recheck inside
  } catch (err) {
    console.error("❌ Failed to load CSRF token:", err);
    showFormMessage("error", "Не вдалося отримати токен безпеки. Спробуйте пізніше.");
  }
});
