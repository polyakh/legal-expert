// frontend-validation.js
import { VALIDATION } from "./shared.js";

export function validateAttachContact(data) {
  const errors = {};

  // Name
  const name = data.name?.trim() || "";
  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < VALIDATION.name.min || name.length > VALIDATION.name.max) {
    errors.name = `Name must be ${VALIDATION.name.min}–${VALIDATION.name.max} characters.`;
  }

  // Email
  const email = data.email?.trim() || "";
  // simple HTML5‐style email check
  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email must be valid.";
  }

  // Phone (optional)
  const rawPhone = data.phone?.trim() || "";

  // Normalize any extra spaces (e.g., double spaces, tabs, etc.)
  const phone = rawPhone.replace(/\s+/g, " ");

  // Optional: log to debug
  console.log("[Validation] Raw phone:", `"${rawPhone}"`);
  console.log("[Validation] Normalized phone:", `"${phone}"`);
  console.log("[Validation] Matches pattern?", VALIDATION.phone.pattern.test(phone));

  if (phone && !VALIDATION.phone.pattern.test(phone)) {
    errors.phone = `Phone must match ${VALIDATION.phone.example} format.`;
  }

  // Message
  const rawMessage = data.message?.trim() || "";
  const message = rawMessage.replace(/\r?\n|\r/g, " ");

  console.log("[Message]", `"${message}"`, message.length);

  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length < VALIDATION.message.min || message.length > VALIDATION.message.max) {
    errors.message = `Message must be ${VALIDATION.message.min}–${VALIDATION.message.max} characters.`;
  }

  // Privacy consent (checkbox → boolean)
  if (!data.privacy) {
    errors.privacy = "Privacy consent must be accepted.";
  }

  return errors;
}
