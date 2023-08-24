const crypto = require('crypto');


const generateConfirmationToken = () => {
  //Generates 20 random bytes and converts to a hexadecimal string
  const token = crypto.randomBytes(20).toString('hex');
  return token;
}

module.exports = {
  generateConfirmationToken
}