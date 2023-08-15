const errorAuthMessage = () => {
    hasErrorAuth();
    const mainDiv = document.getElementsByClassName("centered-div")[0];
    const loginButton = document.getElementById("login");
    const errorMessage = "Sorry, the email and/or password provided is not correct!";

    createErrorAuthMessage(parentDiv, loginButton, errorMessage);
}

const createErrorAuthMessage = (parentElement, elementBefore, errorMessage) => {
    let newElement = document.createElement("p");
    newElement.classList.add("errorMessage");
    newElement.setAttribute("id","error");
    newElement.innerText = errorMessage;

    parentElement.insertBefore(newElement, elementBefore);
}

const checkRememberMe = () => {
    const rememberMeElement = document.getElementById("rememberMe");
    const isChecked = (rememberMeElement.checked === true);
 
    if(isChecked){
        localStorage.setItem("username", emailElement.value);
        localStorage.setItem("password", passwordElement.value);
    }
}

const addErrorMessage = (element, elementBefore, errorMessage) => {
    const onError = isElementOnError(element, elementBefore, errorMessage);
    if (onError)
        return

    element.style.borderColor = "red";
    createErrorMessage(element.parentNode, elementBefore, errorMessage);
    checkLoginButton(passwordElement, emailElement);
}

const isElementOnError = (element,  elementBefore, errorMessage) => {
    const isBorderRed = (element.style.borderColor === "red");
    if (!isBorderRed)
        return false

    const errorElement = document.getElementById("error");
    const sameErrorMessage = (errorElement.innerText == errorMessage);
    if (sameErrorMessage)
        return true

    if (!sameErrorMessage) {
        cleanError(element);
        createErrorMessage(element.parentNode, elementBefore, errorMessage);
        return true;
    }

}

const createErrorMessage = (parentElement, elementBefore, errorMessage) => {
    let newElement = document.createElement("p");
    newElement.classList.add("errorMessage");
    newElement.setAttribute("id","error");
    newElement.innerText = errorMessage;

    parentElement.insertBefore(newElement, elementBefore);
}

const cleanError = (element) => {
    const parentElement = element.parentNode;
    const errorElement = parentElement.querySelector("#error");

    element.style = '';
    parentElement.removeChild(errorElement);
}

const enableLoginButton = () => {
    let loginButton = document.getElementById("login");
    loginButton.removeAttribute('disabled');
}

const disableLoginButton = () => {
    let loginButton = document.getElementById("login");
    loginButton.setAttribute('disabled',"");
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

const checkLoginButton = (passwordElement, emailElement) => {
    const isPasswordEmpty = (passwordElement.value == '');
    const isEmailEmpty = (emailElement.value == '');
    const hasPasswordError = (passwordElement.style.borderColor == 'red');
    const hasEmailError = (emailElement.style.borderColor == 'red');

    if(!hasPasswordError && !hasEmailError && !isPasswordEmpty && !isEmailEmpty){
        enableLoginButton();
        return
    }

    disableLoginButton();
}

module.exports = { errorAuthMessage, createErrorAuthMessage, checkRememberMe, addErrorMessage, isElementOnError,
     createErrorMessage, cleanError, enableLoginButton, disableLoginButton , isValidEmail, checkLoginButton }