import Typography from "../Typography/Typography.jsx";
import Iconography from "../Iconography/Iconography.jsx";
import Button from "../Button/Button.jsx";
import "./PageHeader.scss";

const PageHeader = ({ headerText, onBack, onEdit, variant = "noedit" }) => {   //variants = noedit, edit

    const safeVariant = variant == "edit" || variant == "noedit" ? variant : "edit";

    return (
        <div className="page-header">
            <div className="page-header__title-back-wrapper">
                <button
                    type="button"
                    className="page-header__back-button"
                    aria-label={`back button`}
                    onClick={() => onBack()}
                >
                    <Iconography
                        name="backArrow"
                        className="page-header__back-icon"
                    />
                </button>

                <div className="page-header__title">
                    <Typography variant="h1">{headerText}</Typography>
                </div>
            </div>
            {safeVariant === "edit" && <Button
                type="button"
                className="page-header__edit-button"
                variant="primary"
                onClick={onEdit}
            >
                <Iconography
                    name="editAlt"
                    className="page-header__edit-icon"
                />
                <Typography variant="p2" className="page-header__edit-text">Edit</Typography>
            </Button>}

        </div>
    );
}

export default PageHeader;