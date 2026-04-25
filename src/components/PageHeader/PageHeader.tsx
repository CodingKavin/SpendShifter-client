import Typography from "../Typography/Typography";
import Iconography from "../Iconography/Iconography";
import "./PageHeader.scss";

interface PageHeaderProps {
  headerText: string;
  onBack: () => void;
}


const PageHeader = ({ headerText, onBack }: PageHeaderProps) => {
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
