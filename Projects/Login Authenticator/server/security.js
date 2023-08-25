const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const generateChangeToken = () => {
  //Generates 20 random bytes and converts to a hexadecimal string
  const token = crypto.randomBytes(20).toString('hex');
  return token;
}


const decodeJWTgoogleToken = (credential) => {
  return jwt.decode(credential);
}




module.exports = {
  generateChangeToken, decodeJWTgoogleToken
}