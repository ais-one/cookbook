export type CheckStatus = 'ok' | 'degraded' | 'unhealthy';

export interface CheckResult {
  name: string;
  status: CheckStatus;
  message: string;
  meta?: Record<string, unknown>;
}
