import {
    checkRememberMe, isValidEmail, checkLoginButton,
    addErrorBorder, hasErrorBorder, addErrorMessage,
    setError, removeErrors
} from "./utils.js";

checkLocalStorage();

const showPasswordElement = document.getElementById("showPassword");
showPasswordElement.addEventListener("click", showPassword);

const emailElement = document.getElementById("email");
emailElement.addEventListener("change", validateEmail);

const passwordElement = document.getElementById("password");
passwordElement.addEventListener("change", validateForm);

const loginElement = document.getElementById("login");
loginElement.addEventListener("click", validateLogin);

const mainDiv = document.getElementsByClassName("centered-div")[0];


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
        const beforeElement = document.getElementsByClassName("password")[0];
        setError(emailElement, mainDiv, beforeElement, "email", errorMessage);
        return
    }

    const hasBorderError = emailElement.style.borderColor == "red";
    if (hasBorderError)
        removeErrors(emailElement, "email");

    checkLoginButton(passwordElement, emailElement);
}

function validateForm() {
    const isPasswordFilled = (passwordElement.value !== "");
    const hasPasswordError = (passwordElement.style.borderColor == "red");

    if (!isPasswordFilled) {
        const errorMessage = "Please fill in the password field."
        const beforeElement = document.getElementsByClassName("options")[0];
        setError(passwordElement, mainDiv, beforeElement, "password", errorMessage)
        return
    }

    if (isPasswordFilled && hasPasswordError)
        removeErrors(passwordElement, "password");

    const isEmailFilled = (emailElement.value != "");

    if (!isEmailFilled) {
        const errorMessage = "Please fill in the email field."
        const beforeElement = document.getElementsByClassName("password")[0];
        setError(emailElement, mainDiv, beforeElement, "email", errorMessage);
        return
    }

    checkLoginButton(passwordElement, emailElement);
}

function validateLogin() {
    var configAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailElement.value,
            password: passwordElement.value
        })
    };

    fetch('/', configAPI)
        .then(response => { return response.json() })
        .then(response => {
            if (!response.authenticated) {
                const emailOnError = hasErrorBorder(emailElement);
                const passwordOnError = hasErrorBorder(passwordElement);

                if (emailOnError && passwordOnError)
                    return

                const errorMessage = "I'm sorry, but the email and/or password provided is not correct or does not exist."
                addErrorBorder(emailElement);
                addErrorBorder(passwordElement);
                addErrorMessage(mainDiv, loginElement, "login", errorMessage);
                return
            }
            checkRememberMe(emailElement, passwordElement);
            window.open("/perfil","_self")
        })
        .catch(error => console.log(error))
}

function checkLocalStorage() {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const hasUsername = (username !== null);
    const hasPassword = (password !== null);

    if (hasUsername && hasPassword) {
        const emailElement = document.getElementById("email");
        const passwordElement = document.getElementById("password");
        emailElement.value = username;
        passwordElement.value = password;

        checkLoginButton(emailElement, passwordElement);

    }
}

