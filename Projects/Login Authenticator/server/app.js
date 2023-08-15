const express = require('express');
const { searchUser } = require('./db');
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

app.use(express.static('client'));
app.use(express.json());
app.use('/', loginRouter);
app.listen(port, () => console.log(`Server has started on port: ${port}`));