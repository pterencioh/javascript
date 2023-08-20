const express = require('express');
const path = require('path');
const { searchUser, insertUser } = require('./db');
const app = express();
const loginRouter = express.Router();
const port = 8383;

loginRouter.post('/', async (request, response) => {
    const user = {
        username: request.body.email,
        password: request.body.password
    };

    const data = await searchUser(user);
    const existUser = (data != "");
    response.json({ "authenticated" : existUser });
})

loginRouter.get('/perfil', (request, response) => {
    const directory = path.resolve(__dirname, '..');
    response.sendFile(directory + '/client/perfil.html');
})

loginRouter.get('/signup', (request, response) => {
    const directory = path.resolve(__dirname, '..');
    response.sendFile(directory + '/client/signup.html');
})

loginRouter.post('/signup', async (request, response) => {
    if(!request.body){
        response.send({ 
            "response" : false,
            "message" : "Access denied."
        });
        return
    }
    const user = {
        name: request.body.name,
        username: request.body.email,
        password: request.body.password
    };

    const data = await insertUser(user);
    console.log(data.insertId);
})

loginRouter.get('/forgot', (request, response) => {
    const directory = path.resolve(__dirname, '..');
    response.sendFile(directory + '/client/forgot.html');
})

app.use(express.static('client'));
app.use(express.json());
app.use('/', loginRouter);
app.listen(port, () => console.log(`Server has started on port: ${port}`));