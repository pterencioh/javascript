const showPasswordElement = document.getElementById("showPassword");
showPasswordElement.addEventListener("click", showPassword);

const emailElement = document.getElementById("email");
emailElement.addEventListener("change", validateEmail);

const passwordElement = document.getElementById("password");
passwordElement.addEventListener("change", validateForm);


function showPassword() {
    const inputPassword = document.getElementById("password");
    let inputType = inputPassword.getAttribute("type");

    inputType = inputType === 'password' ? 'text' : 'password';
    inputPassword.setAttribute("type", inputType);
}

function validateEmail() {
    const isValidValue = isValidEmail(emailElement.value);

    if (!isValidValue) {
        const errorMessage = "Please provide a valid email. i.e. 'example@example.com'";
        addErrorMessage(emailElement, errorMessage);
        return
    }

    const haveBorderRed = emailElement.style.borderColor == "red";
    if (haveBorderRed)
        cleanErrors(emailElement);
}

function validateForm() {

    const isEmailValid = (emailElement.value != "" && emailElement.style.borderColor == "");
    const isPasswordValid = (passwordElement.value !== "");

    if (!isEmailValid) {
        updateErrorMessage(emailElement);
        return
    }

    if (!isPasswordValid) {
        addErrorMessage(passwordElement, "Please fill in the password field.");
        return
    }

    enableLoginButton();
}

const addErrorMessage = (element, errorMessage) => {
    const onError = isElementOnError(element, errorMessage);
    if (onError)
        return

    element.style.borderColor = "red";
    createErrorMessage(element, errorMessage);
}


const isElementOnError = (element, errorMessage) => {
    const isBorderRed = (element.style.borderColor === "red");
    if (!isBorderRed)
        return false

    const errorElement = document.getElementsByClassName("errorMessage")[0];
    const sameErrorMessage = (errorElement.innerText == errorMessage);
    const sameError = (isBorderRed && sameErrorMessage);
    if (sameError) {

        return true
    }
    const otherError = (isBorderRed && !sameErrorMessage);
    if (otherError) {
        cleanErrors(element);
        createErrorMessage(element, errorMessage);
        return true;
    }

}


const createErrorMessage = (element, errorMessage) => {
    const parentElement = element.parentNode;

    let newElement = document.createElement("p");
    newElement.classList.add("errorMessage");
    newElement.setAttribute("id","error");
    newElement.innerText = errorMessage;
    parentElement.appendChild(newElement);
}

const cleanErrors = (element) => {
    const parentElement = element.parentNode;
    element.style = '';

    const errorElement = document.getElementsByClassName("errorMessage")[0];
    parentElement.removeChild(errorElement);
}

const updateErrorMessage = (element) => {
    const errorElement = document.getElementsByClassName("errorMessage")[0];
    const existErrorMessage = (errorElement !== undefined);
    if (!existErrorMessage) {
        const errorMessage = "Please fill in the email field.";
        addErrorMessage(element, errorMessage);
        return
    }

    errorElement.innerText = "Please fill in the email field.";
}

/* const canShowLoginButton = () => {
    const isEmailValid = (emailElement.value != "" && emailElement.style.borderColor == "");
    const isPasswordValid = (passwordElement.value !== "");

    if(isEmailValid && isPasswordValid){
        enableLoginButton();
        return
    }

    disableLoginButton();
    
} */
const enableLoginButton = () => {
    let loginButton = document.getElementById("login");
    loginButton.removeAttribute('disabled');
}

const disableLoginButton = () => {
    let loginButton = document.getElementById("login");
    loginButton.addAttribute = 'disabled';
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



