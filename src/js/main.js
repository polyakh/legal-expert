import { loadCsrfToken } from "./csrf-service.js";
import { attachContactHandler } from "./attach-contact-handler.js";
import { initMobileMenu } from "./init-mobile-menu.js";
import { initCookieModal } from "./init-cookie-modal.js";
import {showFormMessage } from './shared.js'
import { ServiceContainer } from './service-container.js'

document.addEventListener("DOMContentLoaded", async () => {

  ServiceContainer.init();
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
