const path = require('path');

const sendResponse = (response, status, message, data = null) => {
    const responseObject = {
        "answer": status >= 200 && status < 300,
        status,
        message,
        data
    };
    response.status(status).json(responseObject);
}

const sendStaticFile = (response, fileName) => {
    const directory = path.resolve(__dirname, '..');
    const filePath = path.join(directory, 'client', fileName);
    response.sendFile(filePath);
}


module.exports = {
    sendResponse, sendStaticFile
}