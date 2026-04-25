import { useState, useRef, useLayoutEffect, type SubmitEvent, type ChangeEvent } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import Typography from "../../components/Typography/Typography.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import logo from "../../assets/Logo/SpendShifter_logo.svg";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validation.js";
import "./SignupPage.scss";

const SignupPage = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    let error = "";
    if (field === "name") error = validateName(value);
    if (field === "email") error = validateEmail(value);
    if (field === "password") error = validatePassword(value);
    if (field === "confirmPassword")
      error = validateConfirmPassword(formData.password, value);

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword,
    );

    const newErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      setSubmitting(false);
      return;
    }

    try {
      await signup({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: { full_name: formData.name.trim() },
          redirectTo: window.location.origin,
        },
      });
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setSuccessMessage("Account created! Verify email before logging in.");
    } catch (error: any) {
      const safeMessage =
        error?.message ||
        "Signup failed";
      setSubmitError(safeMessage);
    } finally {
      setSubmitting(false);
    }
  };

  useLayoutEffect(() => {
    if (successMessage && successRef.current) {
      successRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (submitError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [submitError, successMessage]);

  return (
    <div className="signup">
      <Typography variant="h2" className="signup__header">
        Create Your Account
      </Typography>

      {submitError && (
        <Typography ref={errorRef} variant="p2" className="signup__error">
          {submitError}
        </Typography>
      )}

      {successMessage && (
        <Typography ref={successRef} variant="p2" className="signup__success">
          {successMessage}{" "}
          <Link to="/login" className="signup__login-link">
            Log in here
          </Link>
        </Typography>
      )}

      <form onSubmit={handleSubmit} className="signup__form">
        <div className="signup__icon-wrapper">
          <img src={logo} alt="SpendShifter Logo" className="signup__icon" />
        </div>

        <Input
          type="text"
          placeholder="Full Name"
          className="signup__form-input"
          value={formData.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
          error={errors.name}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          className="signup__form-input"
          value={formData.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
          error={errors.email}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          className="signup__form-input"
          value={formData.password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("password", e.target.value)}
          error={errors.password}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          className="signup__form-input"
          value={formData.confirmPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          required
        />

        <div className="signup__button-wrapper">
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            className="signup__button"
          >
            <Typography variant="p2">Sign Up</Typography>
          </Button>

          <Typography variant="p2" className="signup__login-text">
            Already have an account?{" "}
            <Link to="/login" className="signup__login-link">
              Log in here
            </Link>
          </Typography>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
