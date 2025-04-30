// validation.js  (import this in both server & client)
export const VALIDATION = {
  name: { min: 2, max: 100 },
  message: { min: 10, max: 1000 },
  phone: {
    pattern: /^\+48\s\d{3}\s\d{3}\s\d{3}$/,
    example: "+48 123 456 789",
  },
};

export const FEEDBACK_ID = "form-feedback";

export function showFormMessage(type, text) {
  const block = document.getElementById(FEEDBACK_ID);
  
  if (!block) {
    console.error("Feedback element not found in the DOM");
    return;
  }

  if (!text) {
    // Just hide the block instead of removing
    block.style.display = "none";
    block.setAttribute("aria-hidden", "true");
    return;
  }

  // Update content and styling
  block.textContent = text;
  block.classList.remove("error-msg", "success-msg");
  block.classList.add(type === "error" ? "error-msg" : "success-msg");
  
  // Set appropriate ARIA attributes
  block.setAttribute("role", "alert");
  block.setAttribute("aria-live", "assertive");
  block.setAttribute("aria-hidden", "false");
  
  // Show the element
  block.style.display = "block";
}

export function clearFormMessage() {
  const block = document.getElementById(FEEDBACK_ID);
  if (block) {
    block.style.display = "none";
    block.setAttribute("aria-hidden", "true");
    block.textContent = "";
    block.className = "form-feedback";
  }
}
