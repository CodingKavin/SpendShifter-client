import { describe, it, expect } from 'vitest';
import { 
  validateName, 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword, 
  validateDescription, 
  validateAmount, 
  validateDate 
} from './validation';

describe('Validation Utilities', () => {

  describe('validateName()', () => {
    it('returns empty string for valid names', () => {
      expect(validateName("John Doe")).toBe("");
      expect(validateName("André")).toBe("");
    });

    it('returns error for empty or invalid names', () => {
      expect(validateName("   ")).toBe("Name is required");
      expect(validateName("J")).toBe("Invalid Name");
      expect(validateName("123 Name")).toBe("Invalid Name");
    });
  });

  describe('validateEmail()', () => {
    it('passes valid email formats', () => {
      expect(validateEmail("test@example.com")).toBe("");
      expect(validateEmail("user.name@domain.ca")).toBe("");
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail("plainaddress")).toBe("Email is invalid");
      expect(validateEmail("@no-local.com")).toBe("Email is invalid");
      expect(validateEmail("a".repeat(257) + "@b.com")).toBe("Email must be 256 characters or less");
    });
  });

  describe('validatePassword()', () => {
    it('passes strong passwords', () => {
      expect(validatePassword("SecurePass123")).toBe("");
    });

    it('rejects passwords that are too short or too long', () => {
      expect(validatePassword("sh0rt")).toContain("atleast 8 characters");
      expect(validatePassword("a".repeat(65))).toContain("more than 64 characters");
    });

    it('requires both letters and numbers', () => {
      expect(validatePassword("onlyletters")).toContain("contain letters and numbers");
      expect(validatePassword("12345678")).toContain("contain letters and numbers");
    });
  });

  describe('validateConfirmPassword()', () => {
    it('passes when passwords match', () => {
      expect(validateConfirmPassword("Pass123!", "Pass123!")).toBe("");
    });

    it('fails when passwords do not match', () => {
      expect(validateConfirmPassword("Pass123!", "Different123!")).toBe("Passwords do not match");
    });
  });

  describe('validateDescription()', () => {
    it('passes valid descriptions', () => {
      expect(validateDescription("Grocery shopping")).toBe("");
    });

    it('enforces 36 character limit', () => {
      const longDesc = "This description is definitely way too long for the field";
      expect(validateDescription(longDesc)).toBe("Description must be 36 characters or less");
    });
  });

  describe('validateAmount()', () => {
    it('handles strings and numbers correctly', () => {
      expect(validateAmount("50.25")).toBe("");
      expect(validateAmount(100)).toBe("");
    });

    it('allows leading dots like .50', () => {
      expect(validateAmount(".50")).toBe("");
    });

    it('rejects zero, negative, or excessive amounts', () => {
      expect(validateAmount("0")).toBe("Amount must be greater than 0");
      expect(validateAmount("-10")).toBe("Amount must be greater than 0");
      expect(validateAmount("100000000")).toBe("Amount must be less than 100,000,000");
    });

    it('rejects invalid numeric formats', () => {
      expect(validateAmount(".")).toContain("valid number");
      expect(validateAmount("10.555")).toContain("valid number");
    });
  });

  describe('validateDate()', () => {
    it('passes valid date strings and Date objects', () => {
      expect(validateDate("2024-04-01")).toBe("");
      expect(validateDate(new Date())).toBe("");
    });

    it('rejects invalid dates', () => {
      expect(validateDate("not-a-date")).toBe("Invalid date");
      expect(validateDate("")).toBe("Date is required");
    });
  });
});