import { useState, useRef, useLayoutEffect, type SubmitEvent, type ChangeEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Typography from "../../components/Typography/Typography";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import logo from "../../assets/Logo/SpendShifter_logo.svg";
import "./ForgotPassPage.scss";


const ForgotPassPage = () => {

    const { resetPassword } = useAuth();
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const errorRef = useRef<HTMLDivElement>(null);
    const successRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            await resetPassword(email.trim());
            setMessage("If email is in our system, you will receive a reset link shortly");
            setEmail("");
        } catch (error: any) {
            const safeMessage = error?.message || "Something went wrong."
            setError(safeMessage);
        } finally {
            setSubmitting(false);
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
            {error && <Typography ref={errorRef} variant="p2" className="forgot-password__error" role="alert">{error}</Typography>}
            {message && <Typography ref={successRef} variant="p2" className="forgot-password__message" role="status">{message}</Typography>}

            <form onSubmit={handleSubmit} className="forgot-password__form">
                <div className="forgot-password__icon-wrapper">
                    <img src={logo} alt="SpendShifter Logo" className="forgot-password__icon" />
                </div>
                <Input
                    type="email"
                    placeholder="Email"
                    className="forgot-password__form-input"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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