import "./Input.scss";

const Input = ({
  type = "text",
  placeholder = "",
  label,
  value,
  onChange,
  className = "",
  error = "",
  disabled = false,
  ...props
}) => {
  let combinedClassName = "input";
  if (className) combinedClassName += " " + className;

  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        className={`${combinedClassName} ${error ? "input--error" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      <p className="input__error-msg">{error}</p>
    </div>
  );
};

export default Input;
