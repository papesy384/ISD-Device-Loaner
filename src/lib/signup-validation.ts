const ALLOWED_DOMAINS = ["@student.isd.sn", "@faculty.isd.sn"] as const;

/**
 * Validates that email ends with @student.isd.sn or @faculty.isd.sn.
 */
export function validateEmailDomain(email: string): { valid: true } | { valid: false; reason: "emailDomain" } {
  const normalized = email.trim().toLowerCase();
  const allowed = ALLOWED_DOMAINS.some((d) => normalized.endsWith(d));
  return allowed ? { valid: true } : { valid: false, reason: "emailDomain" };
}

/**
 * Enforces: minimum 6 characters, at least 1 uppercase, at least 1 special character.
 */
export function validatePassword(password: string): { valid: true } | { valid: false; reason: "passwordLength" | "passwordUppercase" | "passwordSpecial" } {
  if (password.length < 6) return { valid: false, reason: "passwordLength" };
  if (!/[A-Z]/.test(password)) return { valid: false, reason: "passwordUppercase" };
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) return { valid: false, reason: "passwordSpecial" };
  return { valid: true };
}

export type SignupValidationError = "emailDomain" | "passwordLength" | "passwordUppercase" | "passwordSpecial";

export interface SignupValidationResult {
  valid: boolean;
  emailError?: SignupValidationError;
  passwordError?: SignupValidationError;
}

/**
 * Runs both email and password validation. Returns first error per field.
 */
export function validateSignup(email: string, password: string): SignupValidationResult {
  const emailResult = validateEmailDomain(email);
  const passwordResult = validatePassword(password);

  return {
    valid: emailResult.valid && passwordResult.valid,
    emailError: !emailResult.valid ? emailResult.reason : undefined,
    passwordError: !passwordResult.valid ? passwordResult.reason : undefined,
  };
}
