import { useState, useRef, useLayoutEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import Typography from "../../components/Typography/Typography.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import logo from "../../assets/Logo/SpendShifter_logo.svg";
import "./ForgotPassPage.scss";


const ForgotPassPage = () => {

    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const errorRef = useRef(null);
    const successRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            await resetPassword(email);
            setMessage("Check your email for a password reset link.");
        } catch (error) {
            const safeMessage = error?.message || error?.error_description || error?.hint || "Something went wrong."
            setError(safeMessage);
        } finally {
            setSubmitting(false);
            setEmail("");
        }
    };

    useLayoutEffect(() => {
        if (message && successRef.current) {
            successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (error && errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [error, message]);

    return (
        <div className="forgot-password">
            <Typography variant="h2" className="forgot-password__header">Forgot Password</Typography>
            {error && <Typography ref={errorRef} variant="p2" className="forgot-password__error">{error}</Typography>}
            {message && <Typography ref={successRef} variant="p2" className="forgot-password__message">{message}</Typography>}

            <form onSubmit={handleSubmit} className="forgot-password__form">
                <div className="forgot-password__icon-wrapper">
                    <img src={logo} alt="SpendShifter Logo" className="forgot-password__icon" />
                </div>
                <Input
                    type="email"
                    placeholder="Email"
                    className="forgot-password__form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="forgot-password__button-wrapper">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={submitting}
                        className="forgot-password__button"
                    >
                        <Typography variant="p2">Send Email</Typography>
                    </Button>

                    <Typography variant="p2" className="forgot-password__login-text">
                        <Link to="/login" className="forgot-password__login-link">
                            Back to Login
                        </Link>
                    </Typography>
                </div>
            </form>
        </div>
    );
}

export default ForgotPassPage;