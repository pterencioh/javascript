const mysql = require('mysql2');
const { LoginDate } = require('./classes'); 


const connect = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'logindb'
    });

    connection.connect(err => {
        if (err)
            return console.error('Erro ao conectar ao banco de dados:', err);

        console.log('Conexão com o banco de dados estabelecida');
    })

    return connection
}

const searchUser = (user) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const sql = "SELECT * FROM users WHERE username = ? AND user_password = ?";
        const params = [user.username, user.password];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            db.end();
        });
    });
}

const insertUser = (user) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const columns = "name, username, user_password, remember_me, login_type, last_login_at";
        const sql = `INSERT INTO users (${columns}) values (? , ? , ? , ? , ? , ?)`;
        const params = [user.name, user.username, user.password, user.remember, user.loginType, user.loginAt];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            db.end();
        });
    });
}

const updateLastLogin = (userID) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const sql = 'UPDATE users SET last_login_at = ? WHERE id = ?';
        const currentDate = new LoginDate().fullDate();
        const params = [currentDate, userID];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            db.end();
        })
    });
}

module.exports = { searchUser, insertUser, updateLastLogin };