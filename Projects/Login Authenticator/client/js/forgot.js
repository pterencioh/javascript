import {
    isValidEmail, setError, removeErrors, checkRecoverButton
} from "./utils.js";

const emailElement = document.getElementById("email");
emailElement.addEventListener("change", validateEmail);
const recoverButton = document.getElementById("recover");
const mainDiv = document.getElementsByClassName("centered-div")[0];

function validateEmail(){
    const isValidValue = isValidEmail(emailElement.value);

    if (!isValidValue) {
        const errorMessage = "Please provide a valid email. i.e. 'example@example.com'";
        setError(emailElement, mainDiv, recoverButton, "email", errorMessage);
        checkRecoverButton(emailElement, "recover");
        return
    }

    const hasBorderError = emailElement.style.borderColor == "red";
    if (hasBorderError)
        removeErrors(emailElement, "email");

    checkRecoverButton(emailElement, "recover");
}
