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

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isTabletOpen, setIsTabletOpen] = useState(false);
  const mobileRef = useRef(null);
  const tabletRef = useRef(null);

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const toggleTablet = () => setIsTabletOpen((prev) => !prev);

  const handlelogout = async () => {
    await logout();
    setIsMobileOpen(false);
    setIsTabletOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    setIsMobileOpen(false);
    setIsTabletOpen(false);
  }, [isAuthenticated]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const clickedOutsideMobile =
        !mobileRef.current || !mobileRef.current.contains(event.target);
      const clickedOutsideTablet =
        !tabletRef.current || !tabletRef.current.contains(event.target);

      if (clickedOutsideMobile && clickedOutsideTablet) {
        setIsMobileOpen(false);
        setIsTabletOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
        setIsTabletOpen(false);
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
            ref={mobileRef}
          >
            <button
              className="navbar__icon-wrapper navbar__profile-btn"
              onClick={toggleMobile}
            >
              <img
                src={profile}
                alt="SpendShifter Logo"
                className="navbar__icon navbar__icon--profile"
              />
            </button>
            {isMobileOpen && (
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
            ref={tabletRef}
          >
            <button
              className="navbar__icon-wrapper navbar__profile-btn"
              onClick={toggleTablet}
            >
              <img
                src={profile}
                alt="SpendShifter Logo"
                className="navbar__icon navbar__icon--profile"
              />
            </button>
            {isTabletOpen && (
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
