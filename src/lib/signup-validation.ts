// Basic email format: non-empty, single @, something before and after with at least one dot in domain
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates that the email has a valid format. Verification is handled by the auth provider (e.g. Supabase email confirmation).
 */
export function validateEmailFormat(email: string): { valid: true } | { valid: false; reason: "emailInvalid" } {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !VALID_EMAIL.test(normalized)) return { valid: false, reason: "emailInvalid" };
  return { valid: true };
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

export type SignupValidationError = "emailInvalid" | "passwordLength" | "passwordUppercase" | "passwordSpecial";

export interface SignupValidationResult {
  valid: boolean;
  emailError?: SignupValidationError;
  passwordError?: SignupValidationError;
}

/**
 * Runs both email and password validation. Returns first error per field.
 * Open registration: any valid email format; verification is done by the auth provider.
 */
export function validateSignup(email: string, password: string): SignupValidationResult {
  const emailResult = validateEmailFormat(email);
  const passwordResult = validatePassword(password);

  return {
    valid: emailResult.valid && passwordResult.valid,
    emailError: !emailResult.valid ? emailResult.reason : undefined,
    passwordError: !passwordResult.valid ? passwordResult.reason : undefined,
  };
}
