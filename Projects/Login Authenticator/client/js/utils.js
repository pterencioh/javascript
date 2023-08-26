const checkRememberMe = (user) => {
    const rememberMeElement = document.getElementById("rememberMe");
    const isChecked = (rememberMeElement.checked === true);

    if (isChecked) {
        localStorage.setItem("name", user.name);
        localStorage.setItem("avatar", user.avatar);
        localStorage.setItem("loginType", "default");
        return
    }

    sessionStorage.setItem("name", user.name);
    sessionStorage.setItem("avatar", user.avatar);
    sessionStorage.setItem("loginType", "default");
}

const enableSubmitButton = (elementId) => {
    let loginButton = document.getElementById(elementId);
    loginButton.removeAttribute('disabled');
}

const disableSubmitButton = (elementId) => {
    let loginButton = document.getElementById(elementId);
    loginButton.setAttribute('disabled', "");
}

const isValidEmail = (valueInput) => {
    /* 
        "/^[a-zA-Z0-9._%+-]+" - Corresponds to the username before the @ symbol. It allows both uppercase and lowercase letters, numbers, 
                                and a few special characters such as dot, hyphen, percent, and plus sign.
        "@[a-zA-Z0-9.-]+"     - Corresponds to the @ symbol and the email domain after the @ symbol. It permits letters, numbers, dots, and hyphens within the domain.
        "\.[a-zA-Z]{2,}$/"    - Matches the top-level domain (TLD) of the email. It requires at least two alphabet letters.
    */
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = regexEmail.test(valueInput);

    return isValid
}

const hasOnlyLetters = (valueInput) => {
    /* 
        "^[A-Za-z ]" - Matches any uppercase or lowercase letter and spaces. 
        "+$"         - Indicates that the preceding character (letters and spaces) should occur one or more times.
    */
    const regexLetters = /^[A-Za-z ]+$/;
    const onlyLetters = regexLetters.test(valueInput);

    return onlyLetters
}

const checkLoginButton = (passwordElement, emailElement, elementId) => {
    const isPasswordEmpty = (passwordElement.value == '');
    const isEmailEmpty = (emailElement.value == '');
    const hasPasswordError = (passwordElement.style.borderColor == 'red');
    const hasEmailError = (emailElement.style.borderColor == 'red');

    if (!hasPasswordError && !hasEmailError && !isPasswordEmpty && !isEmailEmpty) {
        enableSubmitButton(elementId);
        return
    }

    disableSubmitButton(elementId);
}

const addErrorBorder = (element) => {
    element.style.borderColor = "red"
};

const removeErrorBorder = (element) => {
    element.style.borderColor = ""
};

const hasErrorBorder = (element) => {
    return (element.style.borderColor == "red")
};

const addErrorMessage = (mainDiv, beforeElement, type, errorMessage) => {
    let newElement = document.createElement("p");
    newElement.classList.add("errorMessage");
    newElement.setAttribute("id", `error_${type}`);
    newElement.innerText = errorMessage;

    mainDiv.insertBefore(newElement, beforeElement);
};

const removeErrorMessage = (type) => {
    const element = document.getElementById(`error_${type}`);
    element.remove();
};


const hasErrorMessage = (type) => {
    const element = document.getElementById(`error_${type}`);
    return (element != undefined);
};

const setError = (element, mainDiv, beforeElement, type, errorMessage) => {
    const isElementOnError = hasErrorBorder(element);

    if (!isElementOnError) {
        addErrorBorder(element);
        addErrorMessage(mainDiv, beforeElement, type, errorMessage);
        return
    }

    const existErrorMessage = hasErrorMessage(type);
    const getErrorMessage = document.getElementById(`error_${type}`).innerText || "";
    const sameError = (existErrorMessage && getErrorMessage == errorMessage);

    if (sameError)
        return

    if (!sameError) {
        removeErrorMessage(type);
        addErrorMessage(mainDiv, beforeElement, type, errorMessage);
    }
}

const removeErrors = (element, type) => {
    removeErrorBorder(element);
    removeErrorMessage(type);
}

const checkChangeButton = (emailElement, elementId) => {
    const isEmailEmpty = (emailElement.value == "");
    const isEmailError = (emailElement.style.borderColor == "red");

    if (!isEmailEmpty && !isEmailError) {
        enableSubmitButton(elementId);
        return
    }

    disableSubmitButton(elementId);
}

const checkSignupButton = (nameElement, emailElement, passwordElement, confirmElement) => {
    const isNameFilled = (nameElement.value !== "");
    const hasNameError = (nameElement.style.borderColor == "red");
    const isEmailFilled = (emailElement.value !== "");
    const hasEmailError = (emailElement.style.borderColor == "red");
    const isPasswordFilled = (passwordElement.value !== "");
    const hasPasswordError = (passwordElement.style.borderColor == "red");
    const isConfirmFilled = (confirmElement.value !== "");
    const hasConfirmError = (confirmElement.style.borderColor == "red");

    if (isNameFilled && !hasNameError &&
        isEmailFilled && !hasEmailError &&
        isPasswordFilled && !hasPasswordError &&
        isConfirmFilled && !hasConfirmError) {
        enableSubmitButton("signup");
        return
    }
    disableSubmitButton("signup");
}

const checkChangePassButton = (passwordElement, confirmElement) => {
    const isPasswordFilled = (passwordElement.value !== "");
    const hasPasswordError = (passwordElement.style.borderColor == "red");
    const isConfirmFilled = (confirmElement.value !== "");
    const hasConfirmError = (confirmElement.style.borderColor == "red");

    if (isPasswordFilled && !hasPasswordError &&
        isConfirmFilled && !hasConfirmError) {
        enableSubmitButton("changePass");
        return
    }

    disableSubmitButton("changePass");
}

export {
    checkRememberMe, isValidEmail, checkLoginButton,
    addErrorBorder, hasErrorBorder, addErrorMessage,
    setError, removeErrors, checkChangeButton,
    hasOnlyLetters, checkSignupButton, disableSubmitButton,
    checkChangePassButton, hasErrorMessage
};