import Typography from "../Typography/Typography";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <Typography variant="p" className="footer__copy">
        &copy; SpendShifter Inc. All Rights Reserved.
      </Typography>
    </footer>
  );
};

export default Footer;
