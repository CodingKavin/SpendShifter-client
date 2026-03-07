export const validateName = (name) => {
  if (!name.trim()) return "Name is required";
  const regex = /^[\p{L}][\p{L}\s'-]{1,49}$/u;
  if (!regex.test(name)) return "Invalid Name";
  return "";
};

export const validateEmail = (email) => {
  const cleanEmail = email.trim();
  if (!cleanEmail) return "Email is required";
  if (cleanEmail.length > 256) return "Email must be 256 characters or less";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(cleanEmail)) return "Email is invalid";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be atleast 8 characters";
  if (password.length > 64) return "Password cannot be more than 64 characters";

  const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;
  if (!regex.test(password))
    return "Password must be at least 8 characters and contain letters and numbers";
  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};

export const validateDescription = (description) => {
  const cleanDescription = description.trim();
  if (!cleanDescription) return "Description is required";
  if (cleanDescription.length > 36) {
    return "Description must be 36 characters or less";
  }
  return "";
};

export const validateAmount = (amount) => {
  const cleanAmount = amount.trim();
  if (!cleanAmount) return "Amount is required";
  const regex = /^\d+(\.\d{1,2})?$/;
  if (!regex.test(cleanAmount)) {
    return "Amount must be a valid number with up to 2 decimal places";
  }
  const num = Number(cleanAmount);
  if (num >= 100000000) {
    return "Amount must be less than 100,000,000";
  }
  return "";
};

export const validateDate = (date) => {
  if (!date) return "Date is required";
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "Invalid date";
  return "";
};
