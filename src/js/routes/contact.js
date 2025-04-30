import { Router } from "express";

import { contactFormPipeline } from "../middleware/index.js";
import { handleContactForm } from "../controllers/contact-controller.js";

export const contactRouter = Router();

export const CONTACT_ROUTE = "/contact";

contactRouter.post(CONTACT_ROUTE, contactFormPipeline, handleContactForm);
