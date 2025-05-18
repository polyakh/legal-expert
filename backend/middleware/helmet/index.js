import helmet from "helmet";

export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  frameguard: { action: "deny" }, // Prevent clickjacking
  referrerPolicy: { policy: "no-referrer" }, // Prevent leaking internal URLs
  noSniff: true, // Disable MIME-type sniffing
  hidePoweredBy: true,
};

export const helmetMw = helmet(helmetOptions);
