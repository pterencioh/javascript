const { errorAuthMessage, createErrorAuthMessage, checkRememberMe, addErrorMessage, isElementOnError,
    createErrorMessage, cleanError, enableLoginButton, disableLoginButton , isValidEmail, checkLoginButton } = require("utils");

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
        const setBeforeElement = document.getElementsByClassName("password")[0];
        addErrorMessage(emailElement, setBeforeElement, errorMessage);
        return
    }

    const hasBorderError = emailElement.style.borderColor == "red";
    if (hasBorderError)
        cleanError(emailElement);

    checkLoginButton(passwordElement, emailElement);
}

function validateForm() {
    const isPasswordFilled = (passwordElement.value !== "");
    const hasPasswordError = (passwordElement.style.borderColor == "red");

    if(!isPasswordFilled){
        const setBeforeElement = document.getElementsByClassName("options")[0];
        addErrorMessage(passwordElement, setBeforeElement, "Please fill in the password field.");
        return
    }

    if(hasPasswordError)
        cleanError(passwordElement);

    const isEmailFilled = (emailElement.value != "");

    if(!isEmailFilled){
        const setBeforeElement = document.getElementsByClassName("password")[0];
        addErrorMessage(emailElement, setBeforeElement, "Please fill in the email field.");
    }

    checkLoginButton(passwordElement, emailElement);
}

function validateLogin() {
    checkRememberMe();
    var configAPI = {
        method: 'POST',
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({
            email: emailElement.value,
            password: passwordElement.value
        })
    };

    fetch('/', configAPI)
        .then( response => { return response.json() })
        .then( response => { 
            if(!response.authenticated){

            }
        })
        .catch(error  => alert(error))
}

function checkLocalStorage(){
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const hasUsername = (username !== null);
    const hasPassword = (password !== null);

    if(hasUsername && hasPassword){
        const emailElement = document.getElementById("email");
        const passwordElement = document.getElementById("password");
        emailElement.value = username;
        passwordElement.value = password;

        checkLoginButton(emailElement,passwordElement);

    }
}

// checkLocalStorage();
