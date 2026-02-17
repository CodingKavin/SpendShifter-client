export const emptyFieldError = (e, errors, newErrors) => {
    const eventElements = e.currentTarget.querySelectorAll("input"); // Excludes any buttons in the form 

    for (let i = 0; i < eventElements.length; i++) {
        const inputField = eventElements[i];
        if (!inputField.value && errors[inputField.name] !== undefined) { // "errors[inputField.name] !== undefined" ensures dev included field in error useState for validation
                newErrors = {...newErrors, [inputField.name]: "empty"};
        };
    };
    return newErrors;
};

export const validateEmail = (e, errors, newErrors) => {
    const emailAddress = e.currentTarget.querySelector("#email").value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(emailAddress) && errors["email"] !== undefined) {
        newErrors = {...newErrors, "email": "email"};
    } else if (emailPattern.test(emailAddress) && errors["email"] === "email") {
        newErrors = {...newErrors, "email": ""};
    };

    return newErrors;
};

export const validatePhone = (e, errors, newErrors) => {
    const phoneNumber = e.currentTarget.querySelector("#phone").value;
    const phonePattern = /^\+1 \(\d{3}\) \d{3}-\d{4}$/;

    if (!phonePattern.test(phoneNumber) && errors["phone"] !== undefined) {
        newErrors = {...newErrors, "phone": "phone"};
    } else if (phonePattern.test(phoneNumber) && errors["phone"] === "phone") {
        newErrors = {...newErrors, "phone": ""};
    };

    return newErrors;
};

export const removeErrors = (e, errors, setError) => {
    const inputField = e.currentTarget;
    let newErrors = {...errors};

    if (inputField.value && errors[inputField.name] !== undefined) {
            newErrors = {...newErrors, [inputField.name]: ""};
        };
        
    setError(newErrors);
};

export function formatPhoneInput (value) {
    let digits = value.replace(/^\+1 {1}/, "");
    digits = digits.replace(/\D/g, "");
    const match = digits.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    let formatted = "+1 ";
    if (match) {
        if (match[1]) formatted += `(${match[1]})`;
        if (match[2]) formatted += (match[2] ? " " : "") + match[2];
        if (match[3]) formatted += (match[3] ? "-" : "") + match[3];
  }
  return formatted;
}

export const errorType = (errorState) => { // updates error message to user depending on error type
    if(!errorState){
        return
    }
    if(errorState === "empty"){
        return "This field is required";
    }
    if(errorState === "email"){
        return "Please provide a valid email";
    }
    if(errorState === "phone"){
        return "Please provide a valid phone number";
    }
};