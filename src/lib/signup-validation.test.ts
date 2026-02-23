import { describe, it, expect } from "vitest";
import {
  validateEmailFormat,
  validatePassword,
  validateSignup,
} from "./signup-validation";

describe("validateEmailFormat", () => {
  it("rejects empty or invalid email format", () => {
    expect(validateEmailFormat("").valid).toBe(false);
    expect(validateEmailFormat("  ").valid).toBe(false);
    expect(validateEmailFormat("no-at-sign").valid).toBe(false);
    expect(validateEmailFormat("@nodomain").valid).toBe(false);
    expect(validateEmailFormat("nobody@").valid).toBe(false);
    expect(validateEmailFormat("a@b").valid).toBe(false); // no TLD
  });

  it("accepts any valid email address format", () => {
    expect(validateEmailFormat("user@gmail.com").valid).toBe(true);
    expect(validateEmailFormat("user@yahoo.co.uk").valid).toBe(true);
    expect(validateEmailFormat("a@student.isd.sn").valid).toBe(true);
    expect(validateEmailFormat("teacher@faculty.isd.sn").valid).toBe(true);
    expect(validateEmailFormat("name+tag@example.org").valid).toBe(true);
    expect(validateEmailFormat("User@Example.COM").valid).toBe(true);
  });
});

describe("validatePassword", () => {
  it("rejects passwords shorter than 6 characters", () => {
    expect(validatePassword("Ab1!").valid).toBe(false);
    expect(validatePassword("").valid).toBe(false);
    expect(validatePassword("Aa1!").valid).toBe(false);
  });

  it("rejects passwords without an uppercase letter", () => {
    expect(validatePassword("abcdef!").valid).toBe(false);
    expect(validatePassword("123456!").valid).toBe(false);
  });

  it("rejects passwords without a special character", () => {
    expect(validatePassword("Abcdef1").valid).toBe(false);
    expect(validatePassword("ABCDEF6").valid).toBe(false);
  });

  it("accepts valid passwords: 6+ chars, 1 uppercase, 1 special", () => {
    expect(validatePassword("Abcdef!").valid).toBe(true);
    expect(validatePassword("Pass1!").valid).toBe(true);
    expect(validatePassword("A1!aaa").valid).toBe(true);
    expect(validatePassword("MyP@ssw0rd").valid).toBe(true);
  });
});

describe("validateSignup", () => {
  it("returns invalid when email format is wrong", () => {
    const result = validateSignup("invalid", "ValidP@ss1");
    expect(result.valid).toBe(false);
    expect(result.emailError).toBe("emailInvalid");
  });

  it("returns invalid when password is weak", () => {
    const result = validateSignup("user@gmail.com", "weak");
    expect(result.valid).toBe(false);
    expect(result.passwordError).toBeDefined();
  });

  it("returns invalid for both invalid email and weak password", () => {
    const result = validateSignup("x", "a");
    expect(result.valid).toBe(false);
    expect(result.emailError).toBe("emailInvalid");
    expect(result.passwordError).toBe("passwordLength");
  });

  it("returns valid for any valid email format and strong password", () => {
    expect(validateSignup("user@gmail.com", "SecureP@1").valid).toBe(true);
    expect(validateSignup("student@student.isd.sn", "SecureP@1").valid).toBe(true);
    const result = validateSignup("anyone@example.org", "MyP@ss1");
    expect(result.valid).toBe(true);
    expect(result.emailError).toBeUndefined();
    expect(result.passwordError).toBeUndefined();
  });
});
