const cryptoObj = require('crypto');
const {
    aeskeys
} = require('../config/keys/keys');

const bufferEncryption = aeskeys.Buffer_Encryption;
const encryptionType = aeskeys.Encryption_Type;
const encryptionEncoding = aeskeys.Encryption_Encoding;
const aesKey = aeskeys.AES_KEY;
const aesIV = aeskeys.AES_IV;

module.exports = {

    aesEncryption: (plainText) => {

        const key = Buffer.from(aesKey, bufferEncryption);
        const iv = Buffer.from(aesIV, bufferEncryption);
        const cipher = cryptoObj.createCipheriv(encryptionType, key, iv);
        let cipherText = cipher.update(plainText, bufferEncryption, encryptionEncoding);
        cipherText += cipher.final(encryptionEncoding);
        return cipherText;
    },

    aesDecryption: (cipherText) => {

        const buff = Buffer.from(cipherText, encryptionEncoding);
        const key = Buffer.from(aesKey, bufferEncryption);
        const iv = Buffer.from(aesIV, bufferEncryption);
        const decipher = cryptoObj.createDecipheriv(encryptionType, key, iv);
        const plainText = decipher.update(buff) + decipher.final();
        return plainText;
    }
}