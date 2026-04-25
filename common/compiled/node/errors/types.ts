export interface NormalizedError {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
  isOperational: boolean;
}
