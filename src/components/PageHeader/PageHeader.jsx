import Typography from "../Typography/Typography.jsx";
import Iconography from "../Iconography/Iconography.jsx";
import "./PageHeader.scss";

const PageHeader = ({ headerText, onBack }) => {
  return (
    <div className="page-header">
      <div className="page-header__side">
        <button
          type="button"
          className="page-header__back-button"
          aria-label="Go back"
          onClick={onBack}
        >
          <Iconography name="backArrow" className="page-header__back-icon" />
        </button>
      </div>

      <div className="page-header__main">
        <Typography variant="h1">{headerText}</Typography>
      </div>

      <div className="page-header__side"></div>
    </div>
  );
};

export default PageHeader;
