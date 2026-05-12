export class HttpError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace?.(this, HttpError);
  }
}

export const badRequest = (message = "Bad request") =>
  new HttpError(400, message);

export const unauthorized = (message = "Unauthorized") =>
  new HttpError(401, message);

export const forbidden = (message = "Forbidden") => new HttpError(403, message);

export const notFound = (message = "Not found") => new HttpError(404, message);

export const conflict = (message = "Conflict") => new HttpError(409, message);

