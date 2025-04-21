import { Router } from 'express';
import { sendCsrfToken } from '../security/csrf-controller.js';
import { doubleCsrfProtection } from '../security/csrf.js';


export const csrfRouter = Router()

export const CSRF_TOKEN_ROUTE = '/csrf-token';

// Create a special middleware just for the token route
export function initializeCsrf(_req, res, next) {
    // Initialize the cookie without validation
    res.cookie('_csrf', '', {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict'
    });
    next();
  }


csrfRouter.get(CSRF_TOKEN_ROUTE, sendCsrfToken);

