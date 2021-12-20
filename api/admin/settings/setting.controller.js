const moment = require('moment');
const {
    LoggerService,
    appType
} = require('../../../services/logging');
const {
    getAdminProfileOp
} = require('./settings.service');
const {
    aesDecryption,
    aesEncryption
} = require('../../../security/aes_algorithm');

const log = new LoggerService("setting", appType.admin, false);



module.exports = {
    
    getAdminProfile : (req, res) => {
        if (!req.query.admin_id) {
            log.error("Some parameters not found");

            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const adminId = aesDecryption(req.query.admin_id.toString().replace(/ /g, "+"))

        getAdminProfileOp(adminId, (error, admin) => {
            if(error){
                log.error(error);

                return res.status(400).json({
                    response: {
                        result: null,
                        token: req.accessToken ? req.accessToken : ""
                    },
                    errorMessage: aesEncryption(error) 
                });
            }

            admin.id = aesEncryption(admin.id.toString());
            admin.name = aesEncryption(admin.name.toString()); 
            admin.email = aesEncryption(admin.email.toString()); 
            admin.phone_number = aesEncryption(admin.phone_number.toString()); 
            admin.national_number = aesEncryption(admin.national_number.toString()); 
            admin.city = aesEncryption(admin.city.toString()); 
            admin.date_join = aesEncryption(
                moment(admin.date_join).year() !== 1899 ? moment(admin.date_join).format("YYYY-MM-DD") : '0000-00-00');
            admin.profile_image = aesEncryption(admin.profile_image.toString());  
            admin.personal_identity_image = aesEncryption(admin.personal_identity_image.toString());

            log.debug("Success operation")
            return res.status(200).json({
                response: {
                    result: admin,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    updateAdminProfile: (req, res) => 
        res.status(400).json({
            response:{
                result: null,
                token: req.accessToken ? req.accessToken : ""
            },
            errorMessage: aesEncryption("Unsupported yet") 
        }),

    
    requestFacebookId: (req, res) => 
        res.status(400).json({
            response:{
                result: null,
                token: req.accessToken ? req.accessToken : ""
            },
            errorMessage: aesEncryption("Unsupported yet") 
        }),

    addFacebookAccount: (req, res) =>
        res.status(400).json({
            response:{
                result: null,
                token: req.accessToken ? req.accessToken : ""
            },
            errorMessage: aesEncryption("Unsupported yet") 
        }),


    requestMicrosoftId: (req, res) =>
        res.status(400).json({
            response:{
                result: null,
                token: req.accessToken ? req.accessToken : ""
            },
            errorMessage: aesEncryption("Unsupported yet") 
        }),

    addMicrosoftAccount: (req, res) =>
        res.status(400).json({
            response:{
                result: null,
                token: req.accessToken ? req.accessToken : ""
            },
            errorMessage: aesEncryption("Unsupported yet") 
        }),

}