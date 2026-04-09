import { useState, type FC, type KeyboardEvent, type Dispatch, type SetStateAction } from "react";
import Typography from "../Typography/Typography";
import Iconography from "../Iconography/Iconography";
import Button from "../Button/Button";
import "./TablesHeader.scss";

interface TablesHeaderProps {
  headerText: string;
  buttonText: string;
  onButtonClick: () => void;
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>> | ((val: string) => void);
  disabled?: boolean;
}

const TablesHeader: FC<TablesHeaderProps> = ({
  headerText,
  buttonText,
  onButtonClick,
  searchString,
  setSearchString,
  disabled = false,
}) => {
  const [input, setInput] = useState<string>(searchString || "");

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchString(input);
    }
  };

  const handleSearchClick = () => {
    setSearchString(input);
  };

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
        <button
          type="button"
          className="table-header__search-icon-button"
          aria-label="Submit search"
          onClick={handleSearchClick}
        >
          <Iconography name="search" className="table-header__search-icon" />
        </button>
      </div>

      <Button
        type="button"
        className="table-header__button"
        variant="primary"
        onClick={onButtonClick}
        disabled={disabled}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default TablesHeader;
