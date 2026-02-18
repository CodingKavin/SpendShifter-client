import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Typography from "../../components/Typography/Typography.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await login({ email, password });
        } catch (error) {
            setError(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login">
            <Typography variant="h2" className="login__header">Login</Typography>

            {error && (
                <Typography variant="p2" className="login__error">
                    {error}
                </Typography>
            )}

            <form onSubmit={handleSubmit} className="login__form">
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
                    <Button type="button" variant="secondary" disabled={submitting} className="login__button">
                        <Typography variant="p2">Sign Up</Typography>
                    </Button>
                    <Button type="submit" variant="primary" disabled={submitting} className="login__button">
                        <Typography variant="p2">Login</Typography>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;