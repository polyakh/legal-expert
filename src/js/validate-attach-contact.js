// frontend-validation.js


import { ServiceContainer } from './service-container.js'

import { VALIDATION } from "./shared.js";
import { validatePhone } from './form.js'

export function validateAttachContact(data) {
  const errors = {};

  const validator = ServiceContainer.services.validatorService;
  // Name
  const name = data.name?.trim() || "";
  if (!name) {
    errors.name = "Ім'я є обов'язковим.";
  } else if (name.length < VALIDATION.name.min || name.length > VALIDATION.name.max) {
    errors.name = `Ім'я повинно містити від ${VALIDATION.name.min} до ${VALIDATION.name.max} символів.`;
  }

  // Email
  const email = data.email?.trim() || "";
  // simple HTML5‐style email check
  if (!email) {
    errors.email = "Email є обов'язковим.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email повинен бути дійсним.";
  }

  // Phone validation using ServiceContainer
  const rawPhone = data.phone?.trim() || "";
  const countryCode = data.countryCode?.trim() || "+48"; // Default to Poland
  const phone = rawPhone.replace(/\s+/g, "");
  
  if (!rawPhone) {
    errors.phone = "Номер телефону є обов'язковим.";
  } else {
    try {
      const validationResult = validator.validateAndFormatPhoneNumber(countryCode, phone);
      
      if (!validationResult.isValid) {
        errors.phone = validationResult.errors.join(', ');
      }
    } catch (error) {
      errors.phone = `Помилка валідації телефону: ${error.message}`;
    }
  }
  // Message
  const rawMessage = data.message?.trim() || "";
  const message = rawMessage.replace(/\r?\n|\r/g, " ");

  console.log("[Message]", `"${message}"`, message.length);

  if (!message) {
    errors.message = "Повідомлення є обов'язковим.";
  } else if (message.length < VALIDATION.message.min || message.length > VALIDATION.message.max) {
    errors.message = `Повідомлення повинно містити від ${VALIDATION.message.min} до ${VALIDATION.message.max} символів.`;
  }

  // Privacy consent (checkbox → boolean)
  if (!data.privacy) {
    errors.privacy = "Необхідно прийняти згоду на обробку персональних даних.";
  }

  return errors;
}
