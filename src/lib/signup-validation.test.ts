import { describe, it, expect } from "vitest";
import {
  validateEmailDomain,
  validatePassword,
  validateSignup,
} from "./signup-validation";

describe("validateEmailDomain", () => {
  it("rejects emails not ending in @student.isd.sn or @faculty.isd.sn", () => {
    expect(validateEmailDomain("user@gmail.com").valid).toBe(false);
    expect(validateEmailDomain("user@isd.sn").valid).toBe(false);
    expect(validateEmailDomain("user@student.isd.com").valid).toBe(false);
    expect(validateEmailDomain("user@faculty.isd.sn.org").valid).toBe(false);
    expect(validateEmailDomain("").valid).toBe(false);
  });

  it("accepts emails ending in @student.isd.sn", () => {
    expect(validateEmailDomain("a@student.isd.sn").valid).toBe(true);
    expect(validateEmailDomain("student@student.isd.sn").valid).toBe(true);
    expect(validateEmailDomain("User@Student.ISD.SN").valid).toBe(true);
  });

  it("accepts emails ending in @faculty.isd.sn", () => {
    expect(validateEmailDomain("teacher@faculty.isd.sn").valid).toBe(true);
    expect(validateEmailDomain("Admin@Faculty.ISD.SN").valid).toBe(true);
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
  it("returns invalid when email domain is wrong", () => {
    const result = validateSignup("user@gmail.com", "ValidP@ss1");
    expect(result.valid).toBe(false);
    expect(result.emailError).toBe("emailDomain");
  });

  it("returns invalid when password is weak", () => {
    const result = validateSignup("user@student.isd.sn", "weak");
    expect(result.valid).toBe(false);
    expect(result.passwordError).toBeDefined();
  });

  it("returns invalid for both invalid email and weak password", () => {
    const result = validateSignup("x@y.com", "a");
    expect(result.valid).toBe(false);
    expect(result.emailError).toBe("emailDomain");
    expect(result.passwordError).toBe("passwordLength");
  });

  it("returns valid for allowed email and strong password", () => {
    const result = validateSignup("student@student.isd.sn", "SecureP@1");
    expect(result.valid).toBe(true);
    expect(result.emailError).toBeUndefined();
    expect(result.passwordError).toBeUndefined();
  });
});
