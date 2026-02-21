import { Link } from "react-router-dom";
import Typography from "../Typography/Typography.jsx";
import logo from "../../assets/Logo/SpendSavant_logo.svg";
import "./Navigation.scss"

const Navigation = () => {

    return (
        <nav className="navbar">
            <div className="navbar__left">
                <Link to="/dashboard">
                    <div className="navbar__icon-wrapper">
                        <img src={logo} alt="SpendSavant Logo" className="navbar__icon" />
                    </div>
                    <Typography variant="h2" className="navbar__brand">SpendSavant</Typography>
                </Link>
            </div>
            <div className="navbar__center"></div>
            <div className="navbar__right"></div>
        </nav>
    );
}

export default Navigation;