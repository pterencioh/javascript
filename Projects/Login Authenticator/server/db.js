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

const searchAccount = (user) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const sql = "SELECT * FROM users WHERE username = ? AND user_password = ?";
        const params = [user.username, user.password];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            console.log('Database connection completed - searchAccount');
            db.end();
        });
    });
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

const addConfirmationKey = (confirmationKey, userID) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const sql = 'UPDATE users SET confirmation_key = ? WHERE id = ?';
        const params = [confirmationKey, userID];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            console.log('Database connection completed - addConfirmationKey');
            db.end();
        })
    })
}

const confirmAccount = (userID) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const sql = 'UPDATE users SET confirmed = ?, confirmation_key = ? WHERE id = ?'
        const params = [true, "", userID];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            console.log('Database connection completed - confirmAccount');
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

const searchChangeRequest = (userID, confirmationKey) => {
    return new Promise((resolve, reject) => {
        const db = connect();
        const sql = 'SELECT id, confirmed, confirmation_key FROM users WHERE id = ? AND confirmation_key = ? AND confirmed = ?';
        const params = [userID, confirmationKey, false];

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
        const sql = 'SELECT id, username, confirmation_key FROM users WHERE username = ?';
        const params = [email];

        db.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result);
            console.log('Database connection completed - searchEmail');
            db.end();
        })
    })
}

module.exports = { 
    searchAccount, insertUser, updateLastLogin, isUsernameAvailable,
    addConfirmationKey, confirmAccount, updatePassword, searchChangeRequest,
    searchEmail
};