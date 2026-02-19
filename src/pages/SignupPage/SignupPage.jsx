import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import Typography from "../../components/Typography/Typography.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import logo from "../../assets/Logo/SpendSavant_logo.svg";
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "../../utils/validation.js";
import "./SignupPage.scss";

const SignupPage = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        let error = "";
        if (field === "name") error = validateName(value);
        if (field === "email") error = validateEmail(value);
        if (field === "password") error = validatePassword(value);
        if (field === "confirmPassword") error = validateConfirmPassword(formData.password, value);

        setErrors((prev) => ({ ...prev, [field]: error }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError("");

        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword)

        const newErrors = {
            name: nameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((err) => err)) {
            setSubmitting(false);
            return;
        };

        try {
            await signup({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password
            });
            navigate("/")
        } catch (err) {
            setSubmitError(err)
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="signup">
            <Typography variant="h2" className="signup__header">
                Create Your Account
            </Typography>

            {submitError && (
                <Typography variant="p2" className="signup__error">
                    {submitError}
                </Typography>
            )}

            <form onSubmit={handleSubmit} className="signup__form">
                <div className="signup__icon-wrapper">
                    <img src={logo} alt="SpendSavant Logo" className="signup__icon" />
                </div>

                <Input
                    type="text"
                    placeholder="Full Name"
                    className="signup__form-input"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={errors.name}
                    required
                />
                <Input
                    type="email"
                    placeholder="Email"
                    className="signup__form-input"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={errors.email}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    className="signup__form-input"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    error={errors.password}
                    required
                />
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    className="signup__form-input"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
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
