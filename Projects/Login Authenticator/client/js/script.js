const showPasswordElement = document.getElementById("showPassword");
showPasswordElement.addEventListener("click", showPassword);

const emailElement = document.getElementById("email");
emailElement.addEventListener("change", validateEmail);

const passwordElement = document.getElementById("password");
passwordElement.addEventListener("change", validateForm);

const loginElement = document.getElementById("login");
loginElement.addEventListener("click", validateLogin);

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

    const hasBorderError = emailElement.style.borderColor == "red";
    if (hasBorderError)
        cleanError(emailElement);

    checkLoginButton(passwordElement, emailElement);
}

function validateForm() {
    const isPasswordFilled = (passwordElement.value !== "");
    const hasPasswordError = (passwordElement.style.borderColor == "red");

    if(!isPasswordFilled){
        addErrorMessage(passwordElement, "Please fill in the password field.");
        return
    }

    if(hasPasswordError)
        cleanError(passwordElement);

    const isEmailFilled = (emailElement.value != "");

    if(!isEmailFilled){
        addErrorMessage(emailElement, "Please fill in the email field.");
    }

    checkLoginButton(passwordElement, emailElement);
}

function validateLogin() {
    //Checar Remember me
    checkRememberMe();

    fetch('/', {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            email: emailElement.value,
            password: passwordElement.value
        })
    })
        .then(response => { return response.json()})
        .then(data => { alert(JSON.stringify(data)) })
        .catch(error  => alert(error))
    //Validar se o usuário e senha estão validos
    //Enviar para proxima pagina
}

const checkRememberMe = () => {
    const rememberMeElement = document.getElementById("rememberMe");
    const isChecked = (rememberMeElement.checked === true);
 
    if(isChecked){
        localStorage.setItem("username", emailElement.value);
        localStorage.setItem("password", passwordElement.value);

    }
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

const addErrorMessage = (element, errorMessage) => {
    const onError = isElementOnError(element, errorMessage);
    if (onError)
        return

    element.style.borderColor = "red";
    createErrorMessage(element, errorMessage);
    checkLoginButton(passwordElement, emailElement);
}

const isElementOnError = (element, errorMessage) => {
    const isBorderRed = (element.style.borderColor === "red");
    if (!isBorderRed)
        return false

    const errorElement = document.getElementById("error");
    const sameErrorMessage = (errorElement.innerText == errorMessage);
    if (sameErrorMessage)
        return true

    if (!sameErrorMessage) {
        cleanError(element);
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

    element.style.borderColor = "red";
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

checkLocalStorage();