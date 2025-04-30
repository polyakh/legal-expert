import { body } from "express-validator";
import { VALIDATION } from "../shared.js";
import { handleValidationErrorsMw } from "../middleware/index.js";

export const validateContactForm = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({
      min: VALIDATION.name.min,
      max: VALIDATION.name.max,
    })
    .withMessage(`Name must be ${VALIDATION.name.min}–${VALIDATION.name.max} characters.`)
    .escape(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email must be valid.")
    .normalizeEmail(),

  body("phone")
    .optional({ checkFalsy: true })
    .matches(VALIDATION.phone.pattern)
    .withMessage(`Phone must match ${VALIDATION.phone.example} format.`),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .isLength({
      min: VALIDATION.message.min,
      max: VALIDATION.message.max,
    })
    .withMessage(`Message must be ${VALIDATION.message.min}–${VALIDATION.message.max} characters.`)
    .escape(),

  body("privacy")
    .exists()
    .withMessage("Privacy consent is required")
    .isBoolean()
    .withMessage("Privacy consent must be a boolean value")
    .custom((value) => value === true)
    .withMessage("Privacy consent must be accepted"),
  handleValidationErrorsMw,
];
