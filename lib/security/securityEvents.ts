export const SECURITY_EVENT_TYPES = [
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "MFA_SUCCESS",
  "MFA_FAILED",
  "MFA_RESET",
  "RECOVERY_USED",
  "OWNER_ACCESS_GRANTED",
  "OWNER_ACCESS_DENIED",
  "SUDO_ATTEMPT",
  "API_FORBIDDEN",
  "RATE_LIMIT_TRIGGERED",
  "FILE_UPLOAD",
  "PROFILE_CHANGED"
] as const;

export type SecurityEventType = (typeof SECURITY_EVENT_TYPES)[number];

export const SECURITY_SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export type SecuritySeverity = (typeof SECURITY_SEVERITIES)[number];
