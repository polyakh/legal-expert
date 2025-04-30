import { STATUS_CODES } from "../constants/api/status-codes.js";

export class HttpError extends Error {
  constructor(status = STATUS_CODES.SERVER_ERROR, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }

  toJSON() {
    return {
      status: "error",
      statusCode: this.status,
      message: this.message,
      ...(this.details && { errors: this.details }),
    };
  }
}
