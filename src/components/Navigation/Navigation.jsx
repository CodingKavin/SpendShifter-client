import { Link, useNavigate, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Typography from "../Typography/Typography.jsx";
import logo from "../../assets/Logo/SpendShifter_logo.svg";
import profile from "../../assets/Icons/profile.svg";
import "./Navigation.scss";

const Navigation = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropDown = () => {
    setIsOpen((prev) => !prev);
  };

  const handlelogout = async () => {
    await logout();
    navigate("/login");
    setIsOpen(false);
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to={isAuthenticated ? "/dashboard" : "/login"}>
          <div className="navbar__icon-wrapper">
            <img src={logo} alt="SpendShifter Logo" className="navbar__icon" />
          </div>
          <Typography variant="h2" className="navbar__brand">
            SpendShifter
          </Typography>
        </Link>
        {isAuthenticated && (
          <div
            className="navbar__profile navbar__profile--mobile"
            ref={dropdownRef}
          >
            <button
              className="navbar__icon-wrapper navbar__profile-btn"
              onClick={toggleDropDown}
            >
              <img
                src={profile}
                alt="SpendShifter Logo"
                className="navbar__icon navbar__icon--profile"
              />
            </button>
            {isOpen && (
              <div className="navbar__dropdown">
                <button
                  className="navbar__dropdown-item"
                  onClick={handlelogout}
                >
                  <Typography variant="p2" className="navbar__dropdown-text">
                    Logout
                  </Typography>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {isAuthenticated && (
        <div className="navbar__center">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "navbar__tab navbar__tab--active" : "navbar__tab"
            }
          >
            <Typography variant="p2" className="navbar__brand">
              Dashboard
            </Typography>
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              isActive ? "navbar__tab navbar__tab--active" : "navbar__tab"
            }
          >
            <Typography variant="p2" className="navbar__brand">
              Expenses
            </Typography>
          </NavLink>
        </div>
      )}
      {isAuthenticated && (
        <div className="navbar__right">
          <div
            className="navbar__profile navbar__profile--tablet"
            ref={dropdownRef}
          >
            <button
              className="navbar__icon-wrapper navbar__profile-btn"
              onClick={toggleDropDown}
            >
              <img
                src={profile}
                alt="SpendShifter Logo"
                className="navbar__icon navbar__icon--profile"
              />
            </button>
            {isOpen && (
              <div className="navbar__dropdown">
                <button
                  className="navbar__dropdown-item"
                  onClick={handlelogout}
                >
                  <Typography variant="p2" className="navbar__dropdown-text">
                    Logout
                  </Typography>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
