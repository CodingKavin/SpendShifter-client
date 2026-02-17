import { useState } from "react";
import Typography from "../Typography/Typography.jsx";
import Iconography from "../Iconography/Iconography.jsx";
import Button from "../Button/Button.jsx"
import "./TablesHeader.scss";

const TablesHeader = ({ headerText, buttonText, onButtonClick, searchString, setSearchString }) => {

    const [input, setInput] = useState(searchString || "");

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            setSearchString(input);
        }
    }

    const handleSearchClick = () => {
        setSearchString(input)
    }

    return (
        <div className="table-header">
            <div className="table-header__title">
                <Typography variant="h1">{headerText}</Typography>
            </div>

            <div className="table-header__search">
                <input
                    type="text"
                    className="table-header__search-input"
                    placeholder="Search..."
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button type="button" className="table-header__search-icon-button" onClick={handleSearchClick}>
                    <Iconography name="search" className="table-header__search-icon" />
                </button>
            </div>

            <Button
                type="button"
                className="table-header__button"
                variant="primary"
                onClick={onButtonClick}
            >
                {buttonText}
            </Button>
        </div>
    );
};

export default TablesHeader;
