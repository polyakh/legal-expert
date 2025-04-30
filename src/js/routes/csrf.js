import { Router } from "express";
import { sendCsrfToken } from "../security/csrf-controller.js";
import { doubleCsrfProtection } from "../security/csrf.js";

export const csrfRouter = Router();

export const CSRF_TOKEN_ROUTE = "/csrf-token";

csrfRouter.get(CSRF_TOKEN_ROUTE, doubleCsrfProtection, sendCsrfToken);
