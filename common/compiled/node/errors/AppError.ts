/** Base class for all known operational errors. */
export class AppError extends Error {
  statusCode: number;
  code: string;
  details: unknown;
  isOperational: boolean;
  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details: unknown = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/** Thrown when a requested resource does not exist (404). */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

/** Thrown when request input fails schema validation (422). */
export class ValidationError extends AppError {
  constructor(message: string, details: unknown = null) {
    super(message, 422, 'VALIDATION_ERROR', details);
  }
}

/** Thrown when the caller is not authenticated or lacks permission (401). */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}
