import { validationResult } from "express-validator";
import { sendEmail } from '../services/email-service.js'

export function handleContactForm(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "validation-error",
      errors: errors.array(),
    });
  }
  
  const formData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone || null,
    message: req.body.message
  };
  
  // Log the form submission
  console.log("📨 Contact form received:", formData);
  
  // Send email with improved formatting
  sendEmail({
    subject: `Нове повідомлення від ${formData.name}`,
    formData: formData
  })
    .then(() => {
      res.status(200).json({ 
        status: "ok", 
        message: "Form submitted successfully." 
      });
    })
    .catch(error => {
      console.error("❌ Error in contact form handler:", error);
      res.status(500).json({ 
        status: "error", 
        message: "Failed to process your request. Please try again later." 
      });
    });
}
