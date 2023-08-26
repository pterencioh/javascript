const express = require('express');
const bcrypt = require("bcryptjs");
const {
    insertUser, updateLastLogin, isUsernameAvailable,
    addChangeKey, removeChangeKey, updatePassword, searchChangeRequest,
    searchUser
} = require('./db');

const { generateChangeToken, decodeJWTgoogleToken } = require('./security');
const { sendPassChangeEmail } = require('./email');
const { sendResponse, sendStaticFile } = require("./app_utils");
const app = express();
const loginRouter = express.Router();
const port = 8383;

loginRouter.post('/', async (request, response) => {

    try {
        if (!request.body) {
            sendResponse(response, 400, "Access denied.");
            return
        }
        const user = {
            username: request.body.email,
            password: request.body.password
        };

        const data = await searchUser(user.username);
        const existUser = (data != "");

        if (!existUser) {
            sendResponse(response, 404, "The user was not found.");
            return
        }

        const samePassword = await bcrypt.compare(user.password, data[0].user_password);
        if (!samePassword) {
            sendResponse(response, 409, "The user email or password is not valid.");
            return
        }

        if (existUser && samePassword) {

            const setLastLogin = await updateLastLogin(data[0].id);
            if (setLastLogin) {
                sendResponse(response, 200, "The user was found.");
                return
            }
        }


    } catch (error) {
        console.error(error);
        sendResponse(response, 500, "An error occurred while processing your request.");
    }

})

loginRouter.get('/perfil', (request, response) => {
    sendStaticFile(response, "perfil.html")
})

loginRouter.post('/perfil', async (request, response) => {
    try {
        if (!request.body) {
            sendResponse(response, 400, "Access denied.");
            return
        }

        const user = {
            username: request.body.username,
            password: request.body.password
        }

        const data = await searchAccount(user);
        const dataOBJ = {
            name: data[0].name,
            avatar: data[0].profile_avatar
        };

        sendResponse(response, 200, "The user was found.", dataOBJ);

    } catch (error) {
        console.error(error);
        sendResponse(response, 500, "An error occurred while processing your request.");
    }

})

loginRouter.get('/signup', (request, response) => {
    sendStaticFile(response, "signup.html");
})

loginRouter.post('/signup', async (request, response) => {
    try {
        if (!request.body) {
            sendResponse(response, 400, "Access denied.");
            return
        }
        const randomNumber = Math.floor(Math.random() * 10); //Only [0-9]
        const profileAvatar = `./img/user_profile${randomNumber}.png`;

        const hashPass = await bcrypt.hash(request.body.password, 10);
        const user = {
            name: request.body.name,
            username: request.body.email,
            password: hashPass,
            avatar: profileAvatar
        };

        const checkUsername = await isUsernameAvailable(user.username);
        const isAvailable = (checkUsername == "");
        if (!isAvailable) {
            sendResponse(response, 409, "Username already registered.");
            return
        }

        const data = await insertUser(user);
        if (data) {
            const dataOBJ = {
                name: user.name,
                avatar: user.avatar
            };
            sendResponse(response, 200, "User successfully registered.", dataOBJ);
        }

    } catch (error) {
        console.error(error);
        sendResponse(response, 500, "An error occurred while processing your request.");
    }
})

loginRouter.get('/forgot', (request, response) => {
    sendStaticFile(response, "forgot.html");
})

loginRouter.post('/forgot', async (request, response) => {
    try {
        if (!request.body) {
            sendResponse(response, 400, "Access denied.");
            return
        }

        const username = request.body.email;
        const existUsername = await searchUser(username);
        if (!existUsername || existUsername == "") {
            sendResponse(response, 404, "The user was not found.");
            return
        }

        const alreadySentRequest = (existUsername[0].change_key != "");
        if (alreadySentRequest) {
            sendResponse(response, 409, "Already exist a password change request.");
            return
        }

        const userID = existUsername[0].id;
        const changeKey = generateChangeToken();

        const updateUser = await addChangeKey(changeKey, userID);
        if (!updateUser || updateUser == "") {
            sendResponse(response, 500, "An error occurred while updating your change key.");
            return
        }

        const sendEmail = await sendPassChangeEmail(userID, username, changeKey);
        if (sendEmail) {
            sendResponse(response, 200, "Password change email sent successfully.");
            console.log("Password change email sent successfully.");
            return
        }

    } catch (error) {
        console.error(error);
        sendResponse(response, 500, "An error occurred while processing your request.");
    }


})

loginRouter.get('/password', async (request, response) => {
    try {
        const userID = request.query.id;
        const changeKey = request.query.key;
        const isValidID = (userID != undefined && userID != "");
        const isValidKey = (changeKey != undefined && changeKey != "");

        if (!isValidID || !isValidKey) {
            sendResponse(response, 400, "Access denied.");
            return
        }

        const existRequest = await searchChangeRequest(userID, changeKey);

        if (!existRequest || existRequest == "") {
            sendResponse(response, 404, "The request was not found.");
            return
        }

        sendStaticFile(response, "new_password.html");
    } catch (error) {
        console.error(error);
        sendResponse(response, 500, "An error occurred while processing your request.");
    }
})

loginRouter.post('/password', async (request, response) => {
    try {
        if (!request.body) {
            sendResponse(response, 400, "Access denied.");
            return
        }
        const userID = request.body.id;
        const hashPass = await bcrypt.hash(request.body.password, 10);
        const setPass = await updatePassword(hashPass, userID);
        const removeKey = await removeChangeKey(userID);

        if (setPass && removeKey) {
            sendResponse(response, 200, "Password successfully updated.");
        }
    } catch (error) {
        console.error(error);
        sendResponse(response, 500, "An error occurred while processing your request.");
    }
})

loginRouter.post('/google', async (request, response) => {
    try {
        if (!request.body) {
            sendResponse(response, 400, "Access denied.");
            return
        }

        const credential = request.body.jwt;
        const credentialJSON = decodeJWTgoogleToken(credential);

        const getUser = await searchUser(credentialJSON.email, "Google");

        if (!getUser || getUser == "") {
            sendResponse(response, 404, "The user was not registered in database.");
            return
        }

        const dataOBJ = {
            jwt: credentialJSON
        };

        sendResponse(response, 200, "The user was found in database.", dataOBJ);
    } catch (error) {
        console.error(error);
        sendResponse(response, 500, "An error occurred while processing your request.");
    }

})

loginRouter.post('/signupGoogle', async (request, response) => {
    try {
        if (!request.body) {
            sendResponse(response, 400, "Access denied.");
            return
        }

        const credential = request.body.jwt;
        const credentialJSON = decodeJWTgoogleToken(credential);

        const getUser = await searchUser(credentialJSON.email, "Google");
        if (getUser != "") {
            sendResponse(response, 409, "This Google account was already registered.");
            return
        }

        const user = {
            name: credentialJSON.name,
            username: credentialJSON.email,
            password: "NOT REQUIRED",
            avatar: "NOT REQUIRED"
        }

        const data = await insertUser(user, "google");

        if (data) {
            const dataOBJ = {
                jwt: credentialJSON
            };

            sendResponse(response, 200, "Google user successfully registered.", dataOBJ);
        }

    } catch (error) {
        console.error(error);
        sendResponse(response, 500, "An error occurred while processing your request.");
    }
})

app.use(express.static('client'));
app.use(express.json());
app.use('/', loginRouter);
app.listen(port, () => console.log(`Server has started on port: ${port}`));