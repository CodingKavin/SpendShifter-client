import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import Typography from "../../components/Typography/Typography.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import logo from "../../assets/Logo/SpendSavant_logo.svg";
import "./LoginPage.scss"

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await login({ email, password });
            navigate("/dashboard");
        } catch (error) {
            setError(error.message || "Login failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login">
            <Typography variant="h2" className="login__header">Welcome!</Typography>

            {error && (
                <Typography variant="p2" className="login__error">
                    {error}
                </Typography>
            )}

            <form onSubmit={handleSubmit} className="login__form">
                <div className="login__icon-wrapper">
                    <img src={logo} alt="SpendSavant Logo" className="login__icon" />
                </div>
                <Input
                    type="email"
                    placeholder="Email"
                    className="login__form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    className="login__form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="login__button-wrapper">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={submitting}
                        className="login__button"
                    >
                        <Typography variant="p2">Login</Typography>
                    </Button>

                    <Typography variant="p2" className="login__signup-text">
                        Don’t have an account?{" "}
                        <Link to="/register" className="login__signup-link">
                            Sign up here
                        </Link>
                    </Typography>
                </div>

            </form>
        </div>
    );
};

export default LoginPage;