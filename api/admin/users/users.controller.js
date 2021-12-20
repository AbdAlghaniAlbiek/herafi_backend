
const moment = require('moment');
const fs = require('fs');
const {
    LoggerService,
    appType
} = require('../../../services/logging');
const {
    aesDecryption,
    aesEncryption
} = require('../../../security/aes_algorithm');
const {
    sendMail
} = require('../../../services/mailing');
const {
    getGeneralUsersOp,
    getUserDetailsProfileOp,
    getUserDetailsRequestsOp,

    getNewMembersUsersIdsOp,
    getNewMemberUserOp,
    acceptNewMemberUserOp,
    refuseNewMemberUserOp,
    getRefusedNewMemberUserPhotosOp
} = require('./users.service');

const log = new LoggerService("users", appType.admin, false);


module.exports = {

    getGeneralUsers: (req, res) => {
        if (!req.query.page_size || !req.query.offset) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const pageSize = aesDecryption(req.query.page_size);
        const offset = aesDecryption(req.query.offset);
        
        getGeneralUsersOp(pageSize, offset, (error, users) => {
            if (error) {
                log.error(error);
                return res.status(400).json({
                    response: {
                        result: null,
                        token: req.accessToken ? req.accessToken : ""
                    },
                    errorMessage: aesEncryption(error) 
                });
            }

            for (let i = 0; i < users.length; i++) {
                users[i].id = aesEncryption(users[i].id.toString());
                users[i].name = aesEncryption(users[i].name.toString());
                users[i].image_path = aesEncryption(users[i].image_path.toString());
            }

            log.debug("Success operation")
            return res.status(200).json({
                response: {
                    result: users,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getUserDetailsProfile: (req, res) => {
        if (!req.query.user_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const userId = aesDecryption(req.query.user_id.toString().replace(/ /g, "+"));

        getUserDetailsProfileOp(userId, (error, userProfile) => {
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

            userProfile.id = aesEncryption(userProfile.id.toString());
            userProfile.name = aesEncryption(userProfile.name.toString());
            userProfile.email = aesEncryption(userProfile.email.toString());
            userProfile.phone_number = aesEncryption(userProfile.phone_number.toString());
            userProfile.national_number = aesEncryption(userProfile.national_number.toString());
            userProfile.city = aesEncryption(userProfile.city.toString());
            userProfile.date_join = aesEncryption(
                moment(userProfile.date_join).year() !== 1899 ? moment(userProfile.date_join).format("YYYY-MM-DD") : '0000-00-00');
            userProfile.requests_num = aesEncryption(userProfile.requests_num.toString());
            userProfile.profile_image = aesEncryption(userProfile.profile_image.toString());
            userProfile.personal_identity_image = aesEncryption(userProfile.personal_identity_image.toString());
            userProfile.favourites = aesEncryption(userProfile.favourites.toString());
            userProfile.searchs = aesEncryption(userProfile.searchs.toString());

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: userProfile,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: "" 
            });
        });
    },

    getUserDetailsRequests: (req, res) => {
        if (!req.query.user_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const userId = aesDecryption(req.query.user_id.toString().replace(/ /g, "+"));
        
        getUserDetailsRequestsOp(userId, (error, requests) => {
            if (error) {
                log.error(error);
                return res.status(400).json({
                    response: {
                        result: null,
                        token: req.accessToken ? req.accessToken : ""
                    },
                    errorMessage: aesEncryption(error) 
                });
            }

            for (let i = 0; i < requests.length; i++) {
                requests[i].id = aesEncryption(requests[i].id.toString());
                requests[i].name = aesEncryption(requests[i].name.toString());
                requests[i].craftman_name = aesEncryption(requests[i].craftman_name.toString());
                requests[i].process = aesEncryption(requests[i].process.toString());
                requests[i].start_date = aesEncryption(
                    moment(requests[i].start_date).year() !== 1899 ? moment(requests[i].start_date).format("YYYY-MM-DD") : '0000-00-00');
                requests[i].end_date = aesEncryption(
                    moment(requests[i].end_date).year() !== 1899 ? moment(requests[i].end_date).format("YYYY-MM-DD") : '0000-00-00');
                requests[i].cost = aesEncryption(requests[i].cost.toString());
                requests[i].comment = aesEncryption(requests[i].comment.toString());
                requests[i].status = aesEncryption(requests[i].status.toString());
                requests[i].rating = aesEncryption(requests[i].rating.toString());
            }
            
            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: requests,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            }); 
        });
    },



    getNewMembersUsersIds: (req, res) => {
        if (!req.query.page_size || !req.query.offset) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const pageSize = aesDecryption(req.query.page_size);
        const offset = aesDecryption(req.query.offset);

        getNewMembersUsersIdsOp(pageSize, offset, (error, userIds) => {
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

            const newUsersIds = new Array();
            for (let i = 0; i < userIds.length; i++) {
               newUsersIds.push(userIds[i].id);
            }

            for (let i = 0; i < newUsersIds.length; i++) {
                newUsersIds[i] = aesEncryption(newUsersIds[i].toString());
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: newUsersIds,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getNewMemberUser: (req, res) => {
        if (!req.query.user_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const userId = aesDecryption(req.query.user_id.toString().replace(/ /g, "+"));

        getNewMemberUserOp(userId, (error, profile) => {
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

            profile.id = aesEncryption(profile.id.toString());
            profile.name = aesEncryption(profile.name.toString());
            profile.email = aesEncryption(profile.email.toString());
            profile.phone_number = aesEncryption(profile.phone_number.toString());
            profile.national_number = aesEncryption(profile.national_number.toString());
            profile.city = aesEncryption(profile.city.toString());
            profile.date_join = aesEncryption(
                moment(profile.date_join).year() !== 1899 ? moment(profile.date_join).format("YYYY-MM-DD") : '0000-00-00');
            profile.profile_image = aesEncryption(profile.profile_image.toString());
            profile.personal_identity_image = aesEncryption(profile.personal_identity_image.toString());
            

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: profile,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },
   
    acceptNewMemberUser: (req, res) => {
        if (!req.query.user_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const userId = aesDecryption(req.query.user_id.toString().replace(/ /g, "+"));
        
        acceptNewMemberUserOp(userId, (error, email, verifyCode) => {
            if (error) {
                log.error(error);
                return res.status(400).json({
                    response: {
                        result: null,
                        token: req.accessToken ? req.accessToken : ""
                    },
                    errorMessage: aesEncryption(error) 
                });
           }

           const sendedEmail = sendMail(email, verifyCode);
       
           if (sendedEmail.error) {
                log.error("Error when sended email");
                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption("Error when sended email") 
                });
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: aesEncryption("Success"),
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: "" 
            });
       
        });
    },

    refuseNewMemberUser: (req, res) => {
        if (!req.query.user_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const userId = aesDecryption(req.query.user_id.toString().replace(/ /g, "+"));

        getRefusedNewMemberUserPhotosOp(userId, (error, profileImage, personalIdentityImage) => {
            if (error) {
                log.error(error);
                return res.status(400).json({
                    response: {
                        result: null,
                        token: req.accessToken ? req.accessToken : ""
                    },
                    errorMessage: aesEncryption(error) 
                });
            }

            fs.unlink("public/upload/images/users/" + personalIdentityImage, (err) => {
                if(err){
                    log.error(err);
                    return res.status(400).json({
                        response: {
                            result: null,
                            token: req.accessToken ? req.accessToken : ""
                        },
                        errorMessage: aesEncryption(err.toString()) 
                    });
                }

                fs.unlink("public/upload/images/users/" + profileImage, (err2) => {
                    if(err2){
                        log.error(err2);
                        return res.status(400).json({
                            response: {
                                result: null,
                                token: req.accessToken ? req.accessToken : ""
                            },
                            errorMessage: aesEncryption(err2.toString()) 
                        });
                    }

                    refuseNewMemberUserOp(userId, (error2) => {
                        if (error2) {
                            log.error(error2);
                            return res.status(400).json({
                                response: {
                                    result: null,
                                    token: req.accessToken ? req.accessToken : ""
                                },
                                errorMessage: aesEncryption(error2) 
                            });
                       }
            
                       log.debug("Success operation");
                        return res.status(200).json({
                            response: {
                                result: aesEncryption("Success"),
                                token: req.accessToken ? req.accessToken : ""
                            },
                            errorMessage: "" 
                        });
                    });

                });
            });
        });
    }
}


