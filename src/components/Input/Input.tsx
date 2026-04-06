import "./Input.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({
  type = "text",
  placeholder = "",
  label,
  value,
  onChange,
  className = "",
  error = "",
  disabled = false,
  id,
  ...props
}: InputProps) => {
  
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="input__wrapper">
      {label && <label htmlFor={inputId} className="input__label">{label}</label>}
      <input
        id={inputId}
        type={type}
        className={`input ${className} ${error ? "input--error" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {error && <p className="input__error-msg">{error}</p>}
    </div>
  );
};

export default Input;
