const {
    genSaltSync,
    hashSync,
    compare
} = require('bcryptjs');
const {
    hashSaltRounds
} = require('../config/keys/keys');

const hashRounds = hashSaltRounds.HASH_ROUNDS;

module.exports = {

    hashEncryption: (plainText) => {
        const salt = genSaltSync(parseInt(hashRounds,2));
        const cipherText = hashSync(plainText, salt);
        return cipherText;
    },

    hashVerify: (currentPassowrd , hashPassword) =>{
        const result = compare(currentPassowrd, hashPassword);
        return result;
    }
}