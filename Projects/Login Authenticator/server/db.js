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
            return console.error('Error connecting to database:', err);

        console.log('Database connection established');
    })
    return connection
}

const insertUser = (user) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const columns = "name, username, user_password, profile_avatar";
        const sql = `INSERT INTO users (${columns}) values (? , ? , ?, ?)`;
        const params = [user.name, user.username, user.password, user.avatar];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            console.log('Database connection completed - insertUser');
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
            console.log('Database connection completed - updateLastLogin');
            db.end();
        })
    });
}

const isUsernameAvailable = (username) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const sql = 'SELECT username FROM users WHERE username = ?';
        const params = [username];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            console.log('Database connection completed - isUsernameAvailable');
            db.end();
        })
    })
}

const addChangeKey = (changeKey, userID) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const sql = 'UPDATE users SET change_key = ? WHERE id = ?';
        const params = [changeKey, userID];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            console.log('Database connection completed - addChangeKey');
            db.end();
        })
    })
}

const removeChangeKey = (userID) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const sql = 'UPDATE users SET change_key = ? WHERE id = ?';
        const params = ["", userID];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            console.log('Database connection completed - removeChangeKey');
            db.end();
        })
    })
}

const updatePassword = (password, userID) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const sql = 'UPDATE users SET user_password = ? WHERE id = ?';
        const params = [password, userID];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            console.log('Database connection completed - updatePassword');
            db.end();
        })
    })
}

const searchChangeRequest = (userID, changeKey) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const sql = 'SELECT id, change_key FROM users WHERE id = ? AND change_key = ?';
        const params = [userID, changeKey];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            console.log('Database connection completed - searchChangeRequest');
            db.end();
        })
    })
}

const searchEmail = (email) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const sql = 'SELECT * FROM users WHERE username = ?';
        const params = [email];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            console.log('Database connection completed - searchEmail');
            db.end();
        })
    })
}

module.exports = { 
    insertUser, updateLastLogin, isUsernameAvailable,
    addChangeKey, removeChangeKey, updatePassword, searchChangeRequest,
    searchEmail
};