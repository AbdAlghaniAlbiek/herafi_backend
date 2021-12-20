const path = require('path');
const fs = require('fs');

const {
    sign,
    verify,
    decode
} = require('jsonwebtoken');
const {
    aesEncryption, aesDecryption
} = require('./aes_algorithm');
const {
    appsSecretKeyword,
    rsaKeys
} = require('../config/keys/keys');
const {
    appType,
    LoggerService,
} = require('../services/logging');
const pool = require('../config/database');


let log = new LoggerService("security", appType.common, false);

function getRoute(pathUrl) {
    let arrPathUrl = pathUrl.split('/');
    return arrPathUrl[arrPathUrl.length - 2];
}

function getAppType(baseUrl) {
    return baseUrl.splite('/')[1];
}

function signAccessToken(userId) {
    
    const options = {
        algorithm: 'RS512',
        expiresIn: '2h',
        issuer: 'Herafi.com',
        audience: userId.toString()
    };

    // Sign with RSA SHA256 using private key
    const privateKey = fs.readFileSync(path.join(__dirname, '../config', 'cert', 'private.pem'), 'utf-8');
    const token = sign({
            userId: aesEncryption(userId.toString()),
            secretKeyword: aesEncryption(appsSecretKeyword.SECRET_KEYWORD)
        },
        privateKey,
        options);

    //console.log('Get Access token');
    return token;
}

function signRefreshToken(userId) {

    const options = {
        algorithm: 'RS512',
        expiresIn: '20d',
        issuer: 'Herafi.com',
        audience: userId.toString()
    };

    // Sign with RSA SHA256 using private key
    const privateKey = fs.readFileSync(path.join(__dirname, '../config', 'cert', 'private.pem'), 'utf-8');

    const token = sign({
            userId: aesEncryption(userId.toString()),
            secretKeyword: aesEncryption(appsSecretKeyword.SECRET_KEYWORD)
        },
        privateKey,            
        options);

    //console.log('Get Refresh token');
    return token;

}

// I will call this method when the user, craftman or admin login to his app
function updatingRefreshToken(userId, refreshToken, cb) {

    //console.log('UPDATE REFRESH TOKEN');
    pool.query("UPDATE person SET refresh_token =? WHERE id =?",
        [
            refreshToken,
            userId
        ],
        (error, result, field) => {
            if (error) {
                cb("Error in mysql settings or the request on your query is time out");
            }

            if (result.length === 0) {
                cb("The record for this user not found");
            } else {
                console.log('UPDATE SUCCESSFULLY !');
                cb(null);
            }
        });
}

/*async*/ function reIssueTokens(userId, req, res, next) {

    const accessToken = signAccessToken(userId);
    const refreshToken = signRefreshToken(userId);
    //const [accessToken, refreshToken] =await Promise.all([signAccessToken(userId), signRefreshToken(userId)]);

    //console.log('START REISSUE TOKENS');
    pool.query("UPDATE person SET refresh_token =? WHERE id =?",
        [
            refreshToken.toString(),
            userId
        ],
        // eslint-disable-next-line consistent-return
         (error, result, field) => {
            if (error) {
                log.error("Error in mysql settings or the request on your query is time out");
                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption("Error in mysql settings or the request on your query is time out")
                });
            }
             // eslint-disable-next-line no-else-return
             else {
                //console.log('SEND ACCESS TOKEN TO REQ');
                // next();
                // eslint-disable-next-line no-return-assign
                return req.accessToken = accessToken;
                
            }
        });
}

function verifyRefreshToken(refreshToken, req, res, next) {

    //const publicKey = rsaKeys.PUBLIC_KEY;
    const publicKey = fs.readFileSync(path.join(__dirname, '../config', 'cert', 'public.pem'), 'utf-8');

    verify(refreshToken, publicKey.toString(),
        // eslint-disable-next-line consistent-return
        (refTokErr, refTokdec) => {
            if (refTokErr) {
                //console.log('Old token. Not valid anymore');
                log.error("Old token. Not valid anymore");
                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption("Old token. Not valid anymore"),
                });
            }

            //console.log('DECODE REFRESH TOKEN');
            
            const decodePayload = verify(refreshToken , publicKey.toString() , {ignoreExpiration: true , ignoreNotBefore: true , complete: true});
            //console.log(decodePayload);
            reIssueTokens(decodePayload.payload.userId.toString(), log, req, res, next);             //Call this method after call verifyRefreshToken() in somewhere your code
        });
}

// eslint-disable-next-line consistent-return
function verifyAccessToken(req, res, next) {

    try {
        // authToken like 'Bearer <JWT-access-token>'
        const authToken = req.headers.authorization;
        
        if (!authToken) {
            log.error("No auth token provided!");
            return res.status(400).json({
                response: {
                    result: null,
                    token: ""
                },
                errorMessage: aesEncryption("No auth token provided!")
            });
        }

        const accessToken = authToken.split(' ')[1];
        if (!accessToken) {
            log.error("No auth token provided!");
            return res.status(400).json({
                response: {
                    result: null,
                    token: ""
                },
                errorMessage: aesEncryption("No auth token provided!")
            });
        }

        //const publicKey = rsaKeys.PUBLIC_KEY;
        const publicKey = fs.readFileSync(path.join(__dirname, '../config', 'cert', 'public.pem'), 'utf-8');

        verify(accessToken, publicKey.toString(),
            (accTokErr, accTokdec) => {
                if (accTokErr) {

                    //console.log('START CHECK REFRESH TOKEN');
                    // The access token is expired => we'll check refresh token  
                    //First decode the token and get payload
                    const decodePayload = verify(accessToken , publicKey.toString() , {ignoreExpiration: true , ignoreNotBefore: true , complete: true});

                    //console.log(decodePayload);
                    
                    pool.query("SELECT refresh_token FROM person WHERE id = ? LIMIT 1",
                        [
                            aesDecryption(decodePayload.payload.userId.toString()) 
                        ],
                        // eslint-disable-next-line consistent-return
                        (error, results, fields) => {
                            if (error) {
                                log.error("Error in mysql settings or the request on your query is time out");
                                return res.status(400).json({
                                    response: {
                                        result: null,
                                        token: ""
                                    },
                                    errorMessage: aesEncryption("Error in mysql settings or the request on your query is time out")
                                });
                            }
                            if (results.length > 0) {

                                //console.log('VERIFY REFRESH TOKEN');
                                verifyRefreshToken(results[0].refresh_token, log, req, res, next);
                            } 
                            else {
                                log.error("The record for this user not found");
                                return res.status(400).json({
                                    response: {
                                        result: null,
                                        token: ""
                                    },
                                    errorMessage: aesEncryption("The record for this user not found")
                                });
                            }
                        });
                }
                next();
            });
    } 
    catch (err) {

        console.log(err.message.toString())
        log.error(err.message.toString());
        return res.status(400).json({
            response: {
                result: null,
                token: ""
            },
            errorMessage: aesEncryption(err.message.toString())
        });
    }
}

module.exports = {
    signAccessToken: signAccessToken,
    signRefreshToken: signRefreshToken,
    updatingRefreshToken: updatingRefreshToken,
    verifyAccessToken: verifyAccessToken,
    reIssueTokens: reIssueTokens
};