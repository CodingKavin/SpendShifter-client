import { Link, useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Typography from "../Typography/Typography.jsx";
import logo from "../../assets/Logo/SpendSavant_logo.svg";
import profile from "../../assets/Icons/profile.svg";
import "./Navigation.scss"

const Navigation = () => {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropDown = () => {
        setIsOpen(prev => !prev);
    }

    const handlelogout = async () => {
        await logout();
        navigate("/login");
        setIsOpen(false);
    }

    return (
        <nav className="navbar">
            <div className="navbar__left">
                <Link to="/dashboard">
                    <div className="navbar__icon-wrapper">
                        <img src={logo} alt="SpendSavant Logo" className="navbar__icon" />
                    </div>
                    <Typography variant="h2" className="navbar__brand">SpendSavant</Typography>
                </Link>
                <div className="navbar__profile navbar__profile--mobile">
                    <button className="navbar__icon-wrapper navbar__profile-btn"
                        onClick={toggleDropDown}>
                        <img src={profile} alt="SpendSavant Logo" className="navbar__icon navbar__icon--profile" />
                    </button>
                    {isOpen && (
                        <div className="navbar__dropdown">
                            <button className="navbar__dropdown-item"
                                onClick={handlelogout}>
                                <Typography variant="p2" className="navbar__dropdown-text">Logout</Typography>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="navbar__center">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "navbar__tab navbar__tab--active"
                            : "navbar__tab"
                    }
                >
                    <Typography variant="p2" className="navbar__brand">Dashboard</Typography>
                </NavLink>

                <NavLink
                    to="/expenses"
                    className={({ isActive }) =>
                        isActive ? "navbar__tab navbar__tab--active"
                            : "navbar__tab"
                    }
                >
                    <Typography variant="p2" className="navbar__brand">Expenses</Typography>
                </NavLink>
            </div>
            <div className="navbar__right">
                <div className="navbar__profile navbar__profile--tablet">
                    <button className="navbar__icon-wrapper navbar__profile-btn"
                        onClick={toggleDropDown}>
                        <img src={profile} alt="SpendSavant Logo" className="navbar__icon navbar__icon--profile" />
                    </button>
                    {isOpen && (
                        <div className="navbar__dropdown">
                            <button className="navbar__dropdown-item"
                                onClick={handlelogout}>
                                <Typography variant="p2" className="navbar__dropdown-text">Logout</Typography>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navigation;