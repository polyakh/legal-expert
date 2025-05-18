export const contactLimiterMw = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 5, // limit each IP to 5 form submissions per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count all requests, even successful ones
  message: {
    status: 429,
    error: "Too many submissions; please wait before trying again.",
  },
});
