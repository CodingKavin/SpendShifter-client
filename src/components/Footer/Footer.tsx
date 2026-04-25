import Typography from "../Typography/Typography";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <Typography variant="p3" className="footer__copy">
        &copy; {new Date().getFullYear()} SpendShifter Inc. Made by Kavin Paul.
      </Typography>
    </footer>
  );
};

export default Footer;
