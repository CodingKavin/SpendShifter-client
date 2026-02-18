import "./Input.scss";

const Input = ({
    variant = "text", // text, email, password
    label,
    value,
    onChange,
    className = "",
    disabled = false,
    ...props
}) => {
    let type = "text";
    let placeholder = "";

    switch (variant) {
        case "email":
            type = "email";
            placeholder = "example@email.com";
            break;
        case "password":
            type = "password";
            placeholder = "Password@123";
            break;
        default:
            type = "text";
            placeholder = "";
    }

    let combinedClassName = "input";
    if (className) combinedClassName += " " + className;

    return (
        <div className="input-wrapper">
            {label && <label className="input-label">{label}</label>}
            <input
                type={type}
                className={combinedClassName}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                {...props}
            />
        </div>
    );
};

export default Input;
