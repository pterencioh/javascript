import {
    isValidEmail, setError, removeErrors, checkRecoverButton
} from "./utils.js";

const mainDiv = document.getElementsByClassName("centered-div")[0];
const emailElement = document.getElementById("email");
emailElement.addEventListener("change", validateEmail);
const recoverButton = document.getElementById("recover");
recoverButton.addEventListener("click", validateRecover);


function validateEmail() {
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

function validateRecover() {
    const configAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailElement.value
        })
    };

    fetch('/forgot', configAPI)
    .then(response => { return response.json() })
    .then(responseJSON => {
        const userNotFound = (responseJSON.status == 404);
        const hasEmailError = (emailElement.style.borderColor == "red");
        if(userNotFound && !hasEmailError){
            const errorMessage = "Sorry, but the email provided is not correct or he is not registered.";
            setError(emailElement, mainDiv, recoverButton, "email", errorMessage);
            checkRecoverButton(emailElement, "recover");
            return
        }

        const alreadyExistRequest = (responseJSON.status == 409);
        if(alreadyExistRequest){
            alert("ATTENTION, there is already a password change request in the system, please check your email!");
            window.open("/","_self");
            return
        }
        
        const changeRequestSend = (responseJSON.status == 200);
        if(changeRequestSend){
            alert("The password change request was successfully sent to your email!");
            window.open("/","_self");
            return
        }
    })
}