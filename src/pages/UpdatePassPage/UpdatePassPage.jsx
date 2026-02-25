import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Typography from "../../components/Typography/Typography.jsx";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button.jsx";
import logo from "../../assets/Logo/SpendShifter_logo.svg";
import { validatePassword, validateConfirmPassword } from "../../utils/validation.js";
import { supabase } from "../../utils/supabase.js";
import "./UpdatePassPage.scss";

const UpdatePassPage = () => {
    const { updatePassword, logout } = useAuth();
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: ""
    });
    const [submitError, setSubmitError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [validSession, setValidSession] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY" && session) {
                setValidSession(true);
            } else {
                navigate("/login")
            }
        });

        return () => listener.subscription.unsubscribe();
    }, [navigate]);

    const handleChange = (field, value) => {
        const updatedData = { ...formData, [field]: value };
        setFormData(updatedData);

        let error = "";
        if (field === "password") {
            error = validatePassword(value);
        }
        if (field === "confirmPassword") {
            error = validateConfirmPassword(updatedData.password, updatedData.confirmPassword);
        }
        setErrors((prev) => ({ ...prev, [field]: error }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);
        setSuccessMessage(null);

        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
        const newErrors = {
            password: passwordError,
            confirmPassword: confirmPasswordError
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((err) => err)) {
            setSubmitting(false);
            return;
        }

        try {
            await updatePassword(formData.password);
            setSuccessMessage("Password updated successfully! You will be redirected to login");

            setTimeout(async () => {
                await logout();
                navigate("/login");
            }, 2000);
        } catch (error) {
            setSubmitError(error.message || "Failed to update password.")
        } finally {
            setSubmitting(false);
        }
    };

    if (!validSession) return null;

    return (
        <div className="update-password">
            <Typography variant="h2" className="update-password__header">
                Update Your Password
            </Typography>
            {submitError && (
                <Typography variant="p2" className="update-password__error">
                    {submitError}
                </Typography>
            )}
            {successMessage && (
                <Typography variant="p2" className="update-password__success">
                    {successMessage}
                </Typography>
            )}
            <form onSubmit={handleSubmit} className="update-password__form">
                <div className="update-password__icon-wrapper">
                    <img src={logo} alt="SpendShifter Logo" className="update-password__icon" />
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
    )
}

export default UpdatePassPage;