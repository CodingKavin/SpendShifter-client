import { useEffect, useState, useRef, type SubmitEvent, type ChangeEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import Typography from "../../components/Typography/Typography";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import logo from "../../assets/Logo/SpendShifter_logo.svg";
import {
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validation.js";
import "./UpdatePassPage.scss";

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

interface PasswordFormErrors {
  password: string;
  confirmPassword: string;
}

const UpdatePassPage = () => {
  const { updatePassword, logout, isRecovering, isAuthenticated, loading } =
    useAuth();

  const [formData, setFormData] = useState<PasswordFormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<PasswordFormErrors>({
    password: "",
    confirmPassword: "",
  });
  const [submitError, setSubmitError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (successMessage && successRef.current) {
        successRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (submitError && errorRef.current) {
        errorRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [submitError, successMessage]);

  if (loading) {
    return (
      <div className="loading-text">
        <Typography variant="p2">Loading...</Typography>
      </div>
    );
  }

  if (!isRecovering) {
    return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
  }

  const handleChange = (field: keyof PasswordFormData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    let error = "";
    if (field === "password") {
      error = validatePassword(value);
    }
    if (field === "confirmPassword") {
      error = validateConfirmPassword(
        updatedData.password,
        updatedData.confirmPassword,
      );
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword,
    );

    const newErrors: PasswordFormErrors = {
      password: passwordError,
      confirmPassword: confirmPasswordError,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err: string) => err)) {
      setSubmitting(false);
      return;
    }

    try {
      await updatePassword(formData.password);
      setSuccessMessage("Password updated successfully! Redirecting...");

      setTimeout(async () => {
        await logout();
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      const safeMessage =
        error?.message ||
        "Failed to update password.";
      setSubmitError(safeMessage);
      setSubmitting(false);
    }
  };

  return (
    <div className="update-password">
      <Typography variant="h2" className="update-password__header">
        Update Your Password
      </Typography>

      {submitError && (
        <Typography
          ref={errorRef}
          variant="p2"
          className="update-password__error"
        >
          {submitError}
        </Typography>
      )}

      {successMessage && (
        <Typography
          ref={successRef}
          variant="p2"
          className="update-password__success"
        >
          {successMessage}
        </Typography>
      )}

      <form onSubmit={handleSubmit} className="update-password__form">
        <div className="update-password__icon-wrapper">
          <img
            src={logo}
            alt="SpendShifter Logo"
            className="update-password__icon"
          />
        </div>

        <Input
          type="password"
          placeholder="Password"
          className="update-password__form-input"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          required
        />

        <Input
          type="password"
          placeholder="Confirm Password"
          className="update-password__form-input"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          required
        />

        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          className="update-password__button"
        >
          <Typography variant="p2">Submit</Typography>
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassPage;
