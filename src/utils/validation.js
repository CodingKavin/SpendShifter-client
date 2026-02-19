export const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    const regex = /^[\p{L}][\p{L}\s'-]{1,49}$/u;
    if (!regex.test(name)) return "Name contains Invalid Characters";
    return "";
};

export const validateEmail = (email) => {
    const cleanEmail = email.trim();
    if (!cleanEmail) return "Email is required";
    if (cleanEmail.length > 256) return "Email must be 256 characters or less"
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(cleanEmail)) return "Email is invalid";
    return "";
};

export const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be atleast 8 characters";
    if (password.length > 64) return "Password cannot be more than 64 characters";

    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;
    if (!regex.test(password)) return "Password must be at least 8 characters and contain letters and numbers";
    return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
};
