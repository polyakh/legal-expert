export class HttpError extends Error {
  constructor(response) {
    super(`HTTP ${response.status} ${response.statusText}`);
    this.name = "HttpError";
    this.status = response.status;
    this.response = response;
  }
}
