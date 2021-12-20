const passport = require('../services/authentication');
const {
    aesEncryption,
} = require('../security/aes_algorithm');

const {
    signAccessToken,
    signRefreshToken,
    updatingRefreshToken
} = require('../security/jwt_authorization');
const {
    LoggerService,
    appType
} = require('../services/logging')
const pool = require('../config/database');

let log = new LoggerService('auth', appType.common, false);

module.exports = {

    authInit: (app) => {

        app.use(passport.initialize());
        app.use(passport.session());

        app.get('/testing', (req, res) => {
            res.json({Message: "Hello world"});
        });

        // Google Routes
        app.get('/auth/google', passport.authenticate('google', {
            scope: ['profile', 'email'],
            session: false
        }));

        app.get('/auth/google/callback', passport.authenticate('google', {
            session: false,
        }), (err, req, res) => {

            // There is no error but need more information from user
            //req.user conatains on google_id
            if (err === "Need more information") {
                log.debug("Succeeded auth and need more information from user");
                res.status(200).json({
                    response: {
                        result: aesEncryption(req.user),
                        token: ""
                    },
                    errorMessage: aesEncryption(err)
                });
            }
            // Something wrong in authentication process
            else if (err) {
                log.error(`(error message): ${err}`);
                res.status(401).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(err),
                });

            }
            // This is user has an google_id before => sign in directly
            else {
                pool.query("SELECT id FROM person WHERE google_id = ?",
                    [
                        req.user
                    ],
                    (queryError, result, field) => {
                        if (queryError) {
                            log.error(`Error in mysql settings or the request on your query is time out`);
                            res.status(400).json({
                                response: {
                                    result: null,
                                    token: ""
                                },
                                errorMessage: aesEncryption("Error in mysql settings or the request on your query is time out"),
                            });
                        }

                        const userId = result[0].id;
                        const accessToken = signAccessToken(userId);
                        const refreshToken = signRefreshToken(userId);
                        updatingRefreshToken(userId, refreshToken, (error) => {
                            if (error) {
                                log.error(error);
                                res.status(400).json({
                                    response: {
                                        result: null,
                                        token: ""
                                    },
                                    errorMessage: aesEncryption(error),
                                });
                            }

                            //Everything is okay and we have accessToken and refreshToken is updated in db
                            log.debug("successful authentication process");
                            res.status(200).json({
                                response: {
                                    result: aesEncryption(userId),
                                    token: accessToken
                                },
                                errorMessage: "",
                            });
                        });
                    });
            }
        });



        // Microsoft Routes
        app.get('/auth/microsoft', passport.authenticate('microsoft', {
            session: false
        }));
        app.get('/auth/microsoft/callback', passport.authenticate('microsoft', {
            session: false,
        }), (err, req, res) => {

            // There is no error but need more information from user
            //req.user conatains on microsoft_id
            if (err === "Need more information") {
                log.debug("Succeeded auth and need more information from user");
                res.status(200).json({
                    response: {
                        result: aesEncryption(req.user),
                        token: ""
                    },
                    errorMessage: aesEncryption(err)
                });

            }
            // Something wrong in authentication process
            else if (err) {
                log.error(`(error message): ${err}`);
                res.status(401).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(err),
                });

            }
            // This is user has an microsoft_id before => sign in directly
            else {
                pool.query("SELECT id FROM person WHERE microsoft_id = ?",
                    [
                        req.user
                    ],
                    (queryError, result, field) => {
                        if (queryError) {
                            log.error(`Error in mysql settings or the request on your query is time out`);
                            res.status(400).json({
                                response: {
                                    result: null,
                                    token: ""
                                },
                                errorMessage: aesEncryption("Error in mysql settings or the request on your query is time out"),
                            });
                        }

                        const userId = result[0].id;
                        const accessToken = signAccessToken(userId);
                        const refreshToken = signRefreshToken(userId);
                        updatingRefreshToken(userId, refreshToken, (error) => {
                            if (error) {
                                log.error(error);
                                res.status(400).json({
                                    response: {
                                        result: null,
                                        token: ""
                                    },
                                    errorMessage: aesEncryption(error),
                                });
                            }

                            //Everything is okay and we have accessToken and refreshToken is updated in db
                            log.debug("successful authentication process");
                            res.status(200).json({
                                response: {
                                    result: aesEncryption(userId),
                                    token: accessToken
                                },
                                errorMessage: "",
                            });
                        });
                    });
            }
        });


        // Facebook Routes
        app.get('/auth/facebook', passport.authenticate('facebook', {
            session: true,
        }));
        app.get('/auth/facebook/callback', passport.authenticate('facebook', {
            session: true,
        }), (err, req, res) => {

            // There is no error but need more information from user
            //req.user conatains on facebook_id
            if (err === "Need more information") {
                log.error("Succeeded auth and need more information from user");
                res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(err)
                });

            }
            // Something wrong in authentication process
            else if (err) {
                log.error(`(error message): ${err}`);
                res.status(401).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(err),
                });
            }
            // This is user has an facebook_id before => sign in directly
            else {
               res.status(200).json({
                   response:{
                       result: aesEncryption(req.id),
                       token: ""
                   },
                   errorMessage: ""
               })
            }
        });
       
    }
}