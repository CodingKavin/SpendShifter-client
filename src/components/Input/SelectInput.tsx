import type {ReactNode} from "react";
import "./Input.scss";

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  options: Option[];
  error?: string;
}

const SelectInput = ({
  label,
  value,
  onChange,
  options = [],
  className = "",
  error = "",
  disabled = false,
  id,
  ...props
}: SelectInputProps) => {
  const selectId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : id);

  return (
    <div className="input__wrapper">
      {label && (
        <label htmlFor={selectId} className="input__label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`input input--select ${className} ${error ? "input--error" : ""}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      >
        {options.map((opt, index) => (
          <option key={`${opt.value}-${index}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="input__error-msg">{error}</p>}
    </div>
  );
};

export default SelectInput;