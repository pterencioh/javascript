const express = require('express');
const path = require('path');
const { searchAccount, insertUser, updateLastLogin, isUsernameAvailable } = require('./db');
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

app.use(express.static('client'));
app.use(express.json());
app.use('/', loginRouter);
app.listen(port, () => console.log(`Server has started on port: ${port}`));