// middleware/validate.js
import { validationResult } from "express-validator";
import { HttpError } from "../errors/http-error.js";

export function handleValidationErrorsMw(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.param, message: e.msg }));
    return next(new HttpError(422, "Валідація не пройдена", details));
  }
  next();
}
