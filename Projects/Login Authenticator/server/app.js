const express = require('express');
const path = require('path');
const {
    searchAccount, insertUser, updateLastLogin, isUsernameAvailable,
    addConfirmationKey, confirmAccount, updatePassword, searchChangeRequest, 
    searchEmail
} = require('./db');

const { generateConfirmationToken } = require('./security');
const { sendPassChangeEmail } = require('./email');
const app = express();
const loginRouter = express.Router();
const port = 8383;

loginRouter.post('/', async (request, response) => {

    try {
        if (!request.body) {
            response.status(400).json({
                "answer": false,
                "status": 400,
                "message": "Access denied."
            });
            return
        }
        const user = {
            username: request.body.email,
            password: request.body.password
        };

        const data = await searchAccount(user);
        const existUser = (data != "");

        if (existUser) {
            const setLastLogin = await updateLastLogin(data[0].id);
            if (setLastLogin) {
                response.status(200).json({
                    "answer": true,
                    "status": 200,
                    "message": "The user was found.",
                    "data": {
                        name: data[0].name,
                        avatar: data[0].profile_avatar
                    }
                });
                return
            }
        }

        if (!existUser) {
            response.status(404).json({
                "answer": false,
                "status": 404,
                "message": "The user was not found."
            });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({
            "answer": false,
            "status": 500,
            "message": "An error occurred while processing your request."
        });
    }

})

loginRouter.get('/perfil', (request, response) => {
    const directory = path.resolve(__dirname, '..');
    response.sendFile(directory + '/client/perfil.html');
})

loginRouter.post('/perfil', async (request, response) => {
    try {
        if (!request.body) {
            response.status(400).json({
                "answer": false,
                "status": 400,
                "message": "Access denied."
            });
            return
        }
        console.log(JSON.stringify(request.body));
        const user = {
            username: request.body.username,
            password: request.body.password
        }

        const data = await searchAccount(user);
        response.status(200).json({
            "answer": true,
            "status": 200,
            "message": "The user was found.",
            "data": {
                name: data[0].name,
                avatar: data[0].profile_avatar
            }
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            "answer": false,
            "status": 500,
            "message": "An error occurred while processing your request."
        })
    }

})

loginRouter.get('/signup', (request, response) => {
    const directory = path.resolve(__dirname, '..');
    response.sendFile(directory + '/client/signup.html');
})

loginRouter.post('/signup', async (request, response) => {
    try {
        if (!request.body) {
            response.status(400).json({
                "answer": false,
                "status": 400,
                "message": "Access denied."
            });
            return
        }
        const randomNumber = Math.floor(Math.random() * 10); //Only [0-9]
        const profileAvatar = `user_profile${randomNumber}.png`;

        const user = {
            name: request.body.name,
            username: request.body.email,
            password: request.body.password,
            avatar: profileAvatar
        };

        const checkUsername = await isUsernameAvailable(user.username);
        const isAvailable = (checkUsername == "");
        if (!isAvailable) {
            response.status(409).json({
                "answer": false,
                "status": 409,
                "message": "Username already registered."
            });
            return
        }

        const data = await insertUser(user);
        if (data) {
            response.status(200).json({
                "answer": true,
                "status": 200,
                "message": "User successfully registered.",
                "data": {
                    name: user.name,
                    avatar: user.avatar
                }
            })
        }

    } catch (error) {
        console.error(error);
        response.status(500).json({
            "answer": false,
            "status": 500,
            "message": "An error occurred while processing your request."
        })
    }
})

loginRouter.get('/forgot', (request, response) => {
    const directory = path.resolve(__dirname, '..');
    response.sendFile(directory + '/client/forgot.html');
})

loginRouter.post('/forgot', async (request, response) => {
    try {
        if (!request.body) {
            response.status(400).json({
                "answer": false,
                "status": 400,
                "message": "Access denied."
            });
            return
        }

        const username = request.body.email;
        const existUsername = await searchEmail(username);
        if(!existUsername || existUsername == ""){
            response.status(404).json({
                "answer": false,
                "status": 404,
                "message": "The user was not found."
            });
            return
        }

        const alreadySentRequest = (existUsername[0].confirmation_key != "");
        if(alreadySentRequest){
            response.status(409).json({
                "answer": false,
                "status": 409,
                "message": "Already exist a password change request."
            });
            return
        }
        
        const userID = existUsername[0].id;
        const confirmationKey = generateConfirmationToken();

        const updateUser = await addConfirmationKey(confirmationKey, userID);
        if(!updateUser || updateUser == ""){
            response.status(500).json({
                "answer": false,
                "status": 500,
                "message": "An error occurred while updating your confirmation key."
            })
            return
        }

        const sendEmail = await sendPassChangeEmail(userID, username, confirmationKey);
        if(sendEmail){
            response.status(200).json({
                "answer": false,
                "status": 200,
                "message": "Password change email sent successfully"
            });
            console.log("Password change email sent successfully.");
            return
        }

    } catch (error) {
        console.error(error);
        response.status(500).json({
            "answer": false,
            "status": 500,
            "message": "An error occurred while processing your request."
        })
    }


})

loginRouter.get('/password', async (request, response) => {
    try {
        const userID = request.query.id;
        const confirmationKey = request.query.key;
        const isValidID = (userID != undefined && userID != "");
        const isValidKey = (confirmationKey != undefined && confirmationKey != "");

        if (!isValidID || !isValidKey) {
            response.status(400).json({
                "answer": false,
                "status": 400,
                "message": "Access denied."
            });
            return
        }

        const existRequest = await searchChangeRequest(userID, confirmationKey);

        if (!existRequest || existRequest == "") {
            response.status(404).json({
                "answer": false,
                "status": 404,
                "message": "The request was not found."
            });
            return
        }
        const directory = path.resolve(__dirname, '../');
        response.sendFile(directory + '/client/new_password.html');
    } catch (error) {
        console.error(error);
        response.status(500).json({
            "answer": false,
            "status": 500,
            "message": "An error occurred while processing your request."
        })
    }
})

loginRouter.post('/password', async (request, response) => {
    try {
        if (!request.body) {
            response.status(400).json({
                "answer": false,
                "status": 400,
                "message": "Access denied."
            });
            return
        }
        const userID = request.body.id;
        const password = request.body.password;

        const setPass = await updatePassword(password, userID);
        const confirm = await confirmAccount(userID);

        if (setPass && confirm) {
            response.status(200).json({
                "answer": true,
                "status": 200,
                "message": "Password successfully updated."
            })
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({
            "answer": false,
            "status": 500,
            "message": "An error occurred while processing your request."
        })
    }
})
app.use(express.static('client'));
app.use(express.json());
app.use('/', loginRouter);
app.listen(port, () => console.log(`Server has started on port: ${port}`));