import "./FormFields.scss";
import Typography from "../Typography/Typography.jsx";
import Icon from "../Iconography/Iconography.jsx"

// *** Variants ***
// Phone Number
// Email

const FormFields = ({
    htmlFor="",
    inputName="Placeholder",
    variant="text",
    type="text", // text_area, dropdown, radio
    options = [],
    value,
    onChange,
    className,
    placeholder,
}) => {

const fieldType = () => {
    if (type === "text") {
        return (
            <input
            id={htmlFor}
            name={htmlFor}
            type="text"
            className="form-fields__input"
            placeholder={inputName}
            value={value}
            onChange={onChange}
            />
    );
}

if (type === "text_area") {
        return (
            <textarea
            id={htmlFor}
            name={htmlFor}
            type="text_area"
            className="form-fields__text_area"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            />
    );
}

if (type === "numerical") {
        return (
            <input
            id={htmlFor}
            name={htmlFor}
            type="number"
            className="form-fields__input"
            placeholder={placeholder || inputName}
            value={value}
            onChange={onChange}
            min="0"
            />
    );
}


if (type === "dropdown") {
     return (
    <div className = "form-fields__dropdown-wrapper">
            <select
            id={htmlFor}
            name={htmlFor}
            type="dropdown"
            className="form-fields__dropdown"
            placeholder={inputName}
            value={value}
            onChange={onChange}
            >
            <option value="">Please select</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
            ))}
            </select>

            <Icon 
            name="dropdown"
            className="form-fields__dropdown-icon"/>
</div>
    );
}

if (type === "radio") {
      return (
        <div className="form-fields__radio-group">
          {options.map((option) => (
            <label key={option.value} className="form-fields__radio">
              <input
              className="form-fields__radio-input"
                type="radio"
                name={htmlFor}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      );
    }
  //  return null;

};

    return(
        <label className="form-fields__label" htmlFor={htmlFor}>
            <Typography variant="h3" className="form-fields__label-text">{inputName}</Typography>
            <div className="form-fields__input-container">
                {fieldType()}
                <Typography variant="p3" className="form-fields__error">This field is required</Typography>
            </div>
        </label>
    );
}

export default FormFields;