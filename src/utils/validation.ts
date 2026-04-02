export const validateName = (name: string): string => {
  if (!name.trim()) return "Name is required";
  const regex = /^[\p{L}][\p{L}\s'-]{1,49}$/u;
  if (!regex.test(name)) return "Invalid Name";
  return "";
};

export const validateEmail = (email: string): string => {
  const cleanEmail = email.trim();
  if (!cleanEmail) return "Email is required";
  if (cleanEmail.length > 256) return "Email must be 256 characters or less";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(cleanEmail)) return "Email is invalid";
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be atleast 8 characters";
  if (password.length > 64) return "Password cannot be more than 64 characters";

  const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;
  if (!regex.test(password))
    return "Password must be at least 8 characters and contain letters and numbers";
  return "";
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};

export const validateDescription = (description: string): string => {
  const cleanDescription = description.trim();
  if (!cleanDescription) return "Description is required";
  if (cleanDescription.length > 36) {
    return "Description must be 36 characters or less";
  }
  return "";
};

export const validateAmount = (amount: string | number): string => {
  const cleanAmount = String(amount).trim();
  if (!cleanAmount) return "Amount is required";
  const regex = /^\d*(\.\d{1,2})?$/;
  if (!regex.test(cleanAmount) || cleanAmount === ".") {
    return "Amount must be a valid number with up to 2 decimal places";
  }
  const num = Number(cleanAmount);
  if (num <= 0) return "Amount must be greater than 0";
  if (num >= 100000000) {
    return "Amount must be less than 100,000,000";
  }
  return "";
};

export const validateDate = (date: string | Date): string => {
  if (!date) return "Date is required";
  const parsed = date instanceof Date ? date: new Date(date);
  if (isNaN(parsed.getTime())) return "Invalid date";
  return "";
};
