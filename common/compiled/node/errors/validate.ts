// shared/middleware/validate.js
// Express middleware factory — validates req[target] against a Zod schema.
//
// On success  → req[target] is replaced with the parsed (coerced + stripped) value.
// On failure  → calls next(ValidationError) → errorHandler → 422 JSON response.
//
// Usage:
//   router.post('/', validate('body', CreatePaymentBodySchema), asyncWrap(handler))

import { AppError } from './AppError.ts';

class ValidationError extends AppError {
  constructor(message) {
    super(message, 422, 'VALIDATION_ERROR');
  }
}

/**
 * @param {'body' | 'params' | 'query'} target
 * @param {import('zod').ZodTypeAny} schema
 */
export function validate(target, schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      // Zod v4: result.error.issues (renamed from .errors in v3)
      const message = result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ');
      return next(new ValidationError(message));
    }
    req[target] = result.data;
    return next();
  };
}
