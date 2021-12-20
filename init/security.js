const helmet = require('helmet');
const hpp = require('hpp');
const xssClean = require('xss-clean');
const sqlinjection = require('sql-injection');
const multer = require('multer');
const errhand = require('errorhandler');
const rateLimit = require('express-rate-limit');
const hsts = require('hsts');
const torUserHandler = require('tor-detect-middleware');

const {
    nodeEnvironment
} = require('../config/keys/keys');
const {
    LoggerService,
    appType
} = require('../services/logging');
const {
    aesEncryption
} = require('../security/aes_algorithm');

const log = new LoggerService('security', appType.common, false);

module.exports = {

    initSecurity: (app) => {

        //Prevent from requests from tor browser
        app.use(torUserHandler());

        //Implement express-enforces-ssl (convert request from http to https and dealing with https requests)
        // app.enable('trust proxy');
        // app.use(express_enforces_ssl());


        //Implement /strict-Transport-Security/ header to the response. (this header always be with https requests)
        app.use(hsts({
            maxAge: 5256000,  // 30 days in seconds
            includeSubDomains: true,
            preload: true
          }));

        // add sql-injection middleware here
        // app.use(sqlinjection);

        // implement helmet
        app.use(helmet());

        // Implement hpp
        app.use(hpp());

        // Implement xss-clean
        app.use(xssClean());

        // Implement express-rate-limit for development environment
        if (nodeEnvironment.Node_Env === 'development') {
            app.use(errhand());
        }

        // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
        // see https://expressjs.com/en/guide/behind-proxies.html
        // app.set('trust proxy', 1);
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 2000 // limit each IP to 100 requests per windowMs
        });

        //  apply to all requests
        app.use(limiter);

        // Handling error when using multer
        function multerErrorHandler(err, req, res, next) {
            if (err instanceof multer.MulterError) {
                log.error("Error in multer uploading", err);
                res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(err.message.toString())
                });
            }
        }
        app.use(multerErrorHandler);

        // For handling all kinds of errors
        app.use((err, req, res, next) => {

            if (err) {
                //do logging and user-friendly error message display
                log.error(err);
                res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(err.message.toString())
                });
            }
        })
    }
}