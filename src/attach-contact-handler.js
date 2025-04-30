import { validateAttachContact } from "./js/validate-attach-contact.js";
import { showFormMessage, clearFormMessage } from "./js/shared.js";

const SUBMIT_BUTTON_SELECTOR = '[type="submit"]';
const FIELDS_SELECTOR = "input, textarea, button";

export function attachContactHandler(form, csrfToken, endpoint = "/api/contact") {
  const submitButton = form.querySelector(SUBMIT_BUTTON_SELECTOR);
  const allFields = form.querySelectorAll(FIELDS_SELECTOR);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    form.querySelectorAll("input, textarea").forEach((input) => input.setCustomValidity(""));

    const data = Object.fromEntries(new FormData(form).entries());
    data.privacy = form.querySelector('[name="privacy"]').checked;

    const errors = validateAttachContact(data);
    if (Object.keys(errors).length > 0) {
      applyFieldErrors(form, errors);
      return;
    }

    clearFormMessage();

    allFields.forEach((el) => (el.disabled = true));
    const originalBtnText = submitButton.textContent;
    submitButton.textContent = "Надсилання...";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        form.reset();
        showFormMessage("success", "Форму надіслано успішно!");
        return;
      }

      if (res.status === 422 && result.errors) {
        const fieldErrors = Object.fromEntries(result.errors.map((e) => [e.field, e.message]));
        applyFieldErrors(form, fieldErrors);
        showFormMessage("error", "Будь ласка, перевірте форму на помилки.");
        return;
      }

      showFormMessage("error", result.message || "Сталася помилка. Спробуйте пізніше.");
    } catch (err) {
      console.error("❌ Network error:", err);
      showFormMessage("error", "Неможливо з’єднатися із сервером. Спробуйте пізніше.");
    } finally {
      submitButton.textContent = originalBtnText;
      allFields.forEach((el) => (el.disabled = false));
    }
  });
}

function applyFieldErrors(form, errors) {
  for (const [field, message] of Object.entries(errors)) {
    const input = form.querySelector(`[name="${field}"]`);
    if (input) {
      input.setCustomValidity(message);
      input.reportValidity();
    }
  }
  form.querySelector(":invalid")?.focus();
}
