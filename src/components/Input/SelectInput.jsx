import "./Input.scss";

const SelectInput = ({
  label,
  value,
  onChange,
  options = [],
  className = "",
  error = "",
  disabled = false,
  ...props
}) => {
  let combinedClassName = "input input--select";
  if (className) combinedClassName += " " + className;

  return (
    <div className="input__wrapper">
      {label && <label className="input__label">{label}</label>}
      <select
        className={`${combinedClassName} ${error ? "input--error" : ""}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      >
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <p className="input__error-msg">{error}</p>
    </div>
  );
};

export default SelectInput;
