const express = require('express');
const app = express();
const loginRouter = express.Router();
var path = require('path')
const { searchUser } = require('./db');
app.use(express.static('client'));


const port = 8383;

loginRouter.get('/', (req, res) => {
    res.status(200).send("<h1>sup</h1>")
})


loginRouter.post('/', async (request, response) => {
    const user = {
        username: request.body.email,
        password: request.body.password
    };

    const data = await searchUser(user);
    response.json(data);
    console.log(data);
})


app.use(express.json());
app.use('/', loginRouter);
app.listen(port, () => console.log(`Server has started on port: ${port}`));
/* module.exports = app; */