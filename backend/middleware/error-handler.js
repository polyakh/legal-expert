import { STATUS_CODES } from "../constants/api/status-codes.js";
import { ERROR_MESSAGES } from "../constants/messages/error-messages.js";

export function errorHandlerMw(err, _req, res, _next) {
  console.error("❌ Error:", err);
  const status = err.status || STATUS_CODES.SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;
  res
    .status(status)
    .json(err.toJSON ? err.toJSON() : { status: "error", statusCode: status, message });
}
