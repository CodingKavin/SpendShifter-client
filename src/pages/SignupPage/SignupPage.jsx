import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import Typography from "../../components/Typography/Typography.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import logo from "../../assets/Logo/SpendSavant_logo.svg";
import "./SignupPage.scss";

const SignupPage = () => {
    const { signup } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await signup({ name, email, password, confirmPassword });
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="signup">
            <Typography variant="h2" className="signup__header">
                Create Your Account
            </Typography>

            {error && (
                <Typography variant="p2" className="signup__error">
                    {error}
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    type="email"
                    placeholder="Email"
                    className="signup__form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    className="signup__form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    className="signup__form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
