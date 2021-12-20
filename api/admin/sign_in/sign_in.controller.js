const multer = require('multer');
const passport = require('passport');

const {
    LoggerService,
    appType
} = require('../../../services/logging');
const {
    destination,
    uploadingImage
} = require('../../../services/uploading');
const {
    sendMail,
} = require('../../../services/mailing');
const {
    aesEncryption,
    aesDecryption,
} = require('../../../security/aes_algorithm');
const {
    hashEncryption
} = require('../../../security/hash_algorithm');
const {
    signAccessToken,
    signRefreshToken,
    updatingRefreshToken
} = require('../../../security/jwt_authorization');
const {
    getCitiesOp,
    signUpAdminOp,
    requestFacebookIdOp,
    signUpWithFacebookIdOp,
    requestMicrosoftIdOp,
    signUpWithMicrosoftIdOp,
    verifyAdminOp,
    signInAdminOp,
    completeVerifyAdminOp,
    directSignInWithFacebookIdOp,
    directSignInWithMicrosoftIdOp,
    checkIdentityOp,
    completeCheckIdentityOp,
    resetPasswordOp,
    uploadProfileImageOp,
    uploadPersonalIdentityImageOp,
    verificationIdentityOp

} = require('./sign_in.service');
const {
    genRandomValue
} = require('../../../helper/gen_random_value');

const log = new LoggerService("sign_in", appType.admin, false);

module.exports = {

    getCities: (req, res) => {

       getCitiesOp((err, cities) => {
            if(err){
                log.error(err);

                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(err) 
                });
            }

            for(let i = 0; i < cities.length; i++){
                cities[i].id = aesEncryption(cities[i].id.toString());
                cities[i].name = aesEncryption(cities[i].name.toString());
            }

            log.debug("Success Respond");

            return res.status(200).json({
                response: {
                    result: cities,
                    token: ""
                },
                errorMessage: ""
            });
            
       });
    },

    signUpAdmin: (req, res) => {

        if (!req.body.name || !req.body.email || !req.body.password || 
            !req.body.phone_number || !req.body.national_number || !req.body.city) {
                log.error("ome parameter not found");

                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption("ome parameter not found") 
                });
        }

        const verifyCode = genRandomValue();

        const admin = {
            name: aesDecryption(req.body.name),
            email: aesDecryption(req.body.email),
            password: hashEncryption(aesDecryption(req.body.password)),
            phone_number: aesDecryption(req.body.phone_number),
            national_number: aesDecryption(req.body.national_number),
            city_id: aesDecryption(req.body.city)
        };

        signUpAdminOp(admin, verifyCode, (error) => {
            if (error) {
                log.error(error);

                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(error) 
                });
            }

            const sendedEmail = sendMail(admin.email, verifyCode);
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

            log.debug("verify email is sended")

            return res.status(200).json({
                response: {
                    result: aesEncryption("verify email is sended"),
                    token: ""
                },
                errorMessage: ""
            });
        });

    },



    requestFacebookId: (req, res) =>  
        res.status(400).json({
            response: {
                result: null,
                token: ""
            },
            errorMessage: aesEncryption("Unsupported yet")
        }),

    signUpWithFacebookId: (req, res) => {
        if (!req.body.name || !req.body.email || !req.body.password || 
            !req.body.phone_number || !req.body.national_number || !req.body.city || !req.body.facebook_id) {
                log.error("ome parameter not found");

                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption("Some parameter not found") 
                });
        }

        const admin = {
            name: aesDecryption(req.body.name),
            email: aesDecryption(req.body.email),
            password: hashEncryption(aesDecryption(req.body.password)),
            phoneNumber: aesDecryption(req.body.phone_number),
            nationalNumber: aesDecryption(req.body.national_number),
            city: aesDecryption(req.body.city),
            facebookId: aesDecryption(req.body.facebook_id)
        };

        signUpWithFacebookIdOp(admin, (error, adminId) => {
            if (error) {
                log.error(error);
                return res.status(400).json({
                    response:{
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(error)
                });
            }

            let accessToken = signAccessToken(adminId);
            let refreshToken = signRefreshToken(adminId);

            updatingRefreshToken(adminId, refreshToken, (error2) => {
                if (error2) {
                    log.error(error2);

                    return res.status(400).json({
                        response: {
                            result: null,
                            token: ""
                        },
                        errorMessage: aesEncryption(error2) 
                    });
               }

               log.debug("Admin Sign up with facebook id successfully");

               return res.status(200).json({
                    response: {
                        result: aesEncryption(adminId.toString()),
                        token: accessToken
                    },
                    errorMessage: ""
                });
            });
        });
    },



    requestMicrosoftId: (req, res) => 
        res.status(400).json({
            response: {
                result: null,
                token: ""
            },
            errorMessage: aesEncryption("Unsupported yet")
        }),

    signUpWithMicrosoftId: (req, res) => {
        if (!req.body.name || !req.body.email || !req.body.password || 
            !req.body.phone_number || !req.body.national_number || !req.body.city || !req.body.microsoft_id) {
                log.error("ome parameter not found");

                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption("Some parameter not found") 
                });
        }

        const admin = {
            name: aesDecryption(req.body.name),
            email: aesDecryption(req.body.email),
            password: hashEncryption(aesDecryption(req.body.password)),
            phoneNumber: aesDecryption(req.body.phone_number),
            nationalNumber: aesDecryption(req.body.national_number),
            city: aesDecryption(req.body.city),
            microsoftId: aesDecryption(req.body.microsoft_id)
        };

        signUpWithMicrosoftIdOp(admin, (error, adminId) => {
            if (error) {
                log.error(error);
                return res.status(400).json({
                    response:{
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(error)
                });
            }

            let accessToken = signAccessToken(adminId);
            let refreshToken = signRefreshToken(adminId);

            updatingRefreshToken(adminId, refreshToken, (error2) => {
                if (error2) {
                    log.error(error2);

                    return res.status(400).json({
                        response: {
                            result: null,
                            token: ""
                        },
                        errorMessage: aesEncryption(error2) 
                    });
               }

               log.debug("Admin Sign up with microsoft id successfully");

               return res.status(200).json({
                    response: {
                        result: aesEncryption(adminId.toString()),
                        token: accessToken
                    },
                    errorMessage: ""
                });
            });
        });
    },



    verifyAdmin: (req, res) =>{

        if(!req.body){
            log.error("Some parameters not found")

            return res.status(400).json({
                response: {
                    result: null,
                    token: ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const verifyCode = aesDecryption(req.body.code);
        
        verifyAdminOp(verifyCode, (error, adminId) =>{
            if(error){
                log.error(error);

                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(error) 
                });
            }

            const accessToken = signAccessToken(adminId);
            const refreshToken = signRefreshToken(adminId);

            completeVerifyAdminOp(adminId, refreshToken, (error2) => {
                if (error2) {
                    log.status(400).error(error2)

                    return res.json({
                        response: {
                            result: null,
                            token: ""
                        },
                        errorMessage: aesEncryption(error) 
                    });
                }

                log.debug("Admin is verified");
                return res.status(200).json({
                    response: {
                        result: aesEncryption(adminId),
                        token: accessToken
                    },
                    errorMessage: ""
                });
            });
        });
    },



    uploadProfileImage : (req, res) => {
        
        if(!req.body){
            log.error("Some parameters not found")

            return res.json({
                response: {
                    result: null,
                    token: ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }
        
        const upload = uploadingImage(destination.admins, (1024*1024*100)).single('photo');

        upload(req, res, (uploadErr) => {
            
            if (!req.file) {
				log.error("Some thing wrong happening when uploading image");
				return res.status(400).json({
					response: {
						result: null,
						token: ""
					},
					errorMessage: aesEncryption("Some thing wrong happening when uploading image")
				});
            }
            if (uploadErr instanceof multer.MulterError) {
				log.error("Error from multer library");
				return res.status(400).json({
					response: {
						result: null,
						token: ""
					},
					errorMessage: aesEncryption("Error from multer library")
				});
			}
            if (uploadErr) {
				log.error(uploadErr);
				return res.status(400).json({
					response: {
						result: null,
						token: ""
					},
					errorMessage: aesEncryption(uploadErr.toString())
				});
			}

            const adminId = aesDecryption(req.body.admin_id.toString().replace(/ /g, "+"))

            log.debug('The image is uploaded successfully');
            uploadProfileImageOp(adminId, req.file.filename, (error) => {
                if (error) {
                    return res.status(400).json({
                        response: {
                            result: null,
                            token: ""
                        },
                        errorMessage: aesEncryption(error)
                    });
                }

                log.debug('the process is completed successfully');
				return res.status(200).json({
					response: {
						result: aesEncryption("Success"),
						token: req.accessToken ? req.accessToken : ""
					},
					errorMessage: ""
				});
            });
        });
    },

    uploadPersonalIdentityImage : (req, res) => {

        if(!req.body){
            log.error("Some parameters not found")

            return res.status(400).json({
                response: {
                    result: null,
                    token: ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const upload = uploadingImage(destination.admins, (1024*1024*100)).single('photo');

        upload(req, res, (uploadErr) => {
            
            if (!req.file) {
				log.error("Some thing wrong happening when uploading image");
				return res.status(400).json({
					response: {
						result: null,
						token: ""
					},
					errorMessage: aesEncryption("Some thing wrong happening when uploading image")
				});
            }
            if (uploadErr instanceof multer.MulterError) {
				log.error("Error from multer library");
				return res.status(400).json({
					response: {
						result: null,
						token: ""
					},
					errorMessage: aesEncryption("Error from multer library")
				});
			}
            if (uploadErr) {
				log.error(uploadErr);
				return res.status(400).json({
					response: {
						result: null,
						token: ""
					},
					errorMessage: aesEncryption(uploadErr.toString())
				});
			}

            let adminId = aesDecryption(req.body.admin_id.toString().replace(/ /g, "+"))

            log.debug('The image is uploaded successfully');
            uploadPersonalIdentityImageOp(adminId, req.file.filename, (error) => {
                if (error) {
                    return res.status(400).json({
                        response: {
                            result: null,
                            token: ""
                        },
                        errorMessage: aesEncryption(error)
                    });
                }

                log.debug('the process is completed successfully');
				return res.status(200).json({
					response: {
						result: aesEncryption("Success"),
						token: req.accessToken ? req.accessToken : ""
					},
					errorMessage: ""
				});
            });
        });
    },



    signInAdmin: (req, res) =>{
        if(!req.body.email || !req.body.password){
            log.error("Some parameters not found");

            return res.status(400).json({
                response: {
                    result: null,
                    token: ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        let admin = {
            email: aesDecryption(req.body.email),
            password : aesDecryption(req.body.password) 
        };

        signInAdminOp(admin, (error, adminId) =>{
            if(error){
                log.error(error);

                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(error) 
                });
            }

            const accessToken = signAccessToken(adminId);
            const refreshToken = signRefreshToken(adminId);

           updatingRefreshToken(adminId, refreshToken, (error2) => {
               if (error2) {
                    log.error(error2);

                    return res.status(400).json({
                        response: {
                            result: null,
                            token: ""
                        },
                        errorMessage: aesEncryption(error2) 
                    });
               }

               log.debug("Admin sign in successfully");

               return res.status(200).json({
                    response: {
                        result: aesEncryption(adminId),
                        token: accessToken
                    },
                    errorMessage: ""
                });
           });
        });
    },

    directSignInAdmin: (req, res) =>{
        if(!req.body.admin_id){
            log.error("Some parameters not found");

            return res.status(400).json({
                response: {
                    result: null,
                    token: ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const adminId = aesDecryption(req.body.admin_id);

        const accessToken = signAccessToken(adminId);
        const refreshToken = signRefreshToken(adminId);

        updatingRefreshToken(adminId, refreshToken, (error2) => {
            if (error2) {
                log.error(error2);

                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(error2) 
                });
            }

            log.debug("Admin sign in successfully");

            return res.status(200).json({
                response: {
                    result: aesEncryption(adminId.toString()),
                    token: accessToken
                },
                errorMessage: ""
            });
        });
    },

    directSignInWithFacebookId: (req, res) =>{
        if(!req.body.facebook_id){
            log.error("Some parameters not found");

            return res.status(400).json({
                response: {
                    result: null,
                    token: ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const facebookId = aesDecryption(req.body.facebook_id);

        directSignInWithFacebookIdOp(facebookId, (error, adminId) => {
            if(error){
                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(error) 
                });
            }

            const accessToken = signAccessToken(adminId);
            const refreshToken = signRefreshToken(adminId);

            updatingRefreshToken(adminId, refreshToken, (error2) => {
                if (error2) {
                    log.error(error2);

                    return res.status(400).json({
                        response: {
                            result: null,
                            token: ""
                        },
                        errorMessage: aesEncryption(error2) 
                    });
                }

                log.debug("Admin sign in successfully");

                return res.status(200).json({
                    response: {
                        result: aesEncryption(adminId.toString()),
                        token: accessToken
                    },
                    errorMessage: ""
                });
            });
        });
    },

    directSignInWithMicrosoftId: (req, res) =>{
        if(!req.body.microsoft_id){
            log.error("Some parameters not found");

            return res.status(400).json({
                response: {
                    result: null,
                    token: ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const microsoftId = aesDecryption(req.body.microsoft_id);

        directSignInWithMicrosoftIdOp(microsoftId, (error, adminId) => {
            if(error){
                return res.status(400).json({
                    response: {
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(error) 
                });
            }

            const accessToken = signAccessToken(adminId);
            const refreshToken = signRefreshToken(adminId);

            updatingRefreshToken(adminId, refreshToken, (error2) => {
                if (error2) {
                    log.error(error2);

                    return res.status(400).json({
                        response: {
                            result: null,
                            token: ""
                        },
                        errorMessage: aesEncryption(error2) 
                    });
                }

                log.debug("Admin sign in successfully");

                return res.status(200).json({
                    response: {
                        result: aesEncryption(adminId.toString()),
                        token: accessToken
                    },
                    errorMessage: ""
                });
            });
        });
    },

    checkIdentity: (req, res) => {
        if(!req.body.cerdiential){
            log.error("Some parameters not found");

            return res.status(400).json({
                response: {
                    result: null,
                    token: ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const decCerdiential = aesDecryption(req.body.cerdiential);

        checkIdentityOp(decCerdiential, (error, adminId) => {
            if (error) {
                log.error(error);
                return res.status(400).json({
                    response:{
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(error)
                });
            }

            const verifyCode = genRandomValue();

            completeCheckIdentityOp(adminId, verifyCode, (error2, email) => {
                if (error2) {
                    log.error(error2);
                    return res.status(400).json({
                        response:{
                            result: null,
                            token: ""
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
    
                log.debug("verify email is sended");

                return res.status(200).json({
                    response:{
                        result: aesEncryption("verify email is sended successfully"),
                        token: ""
                    },
                    errorMessage: ""
                });
                
            });
        });
    },

    verificationIdentity: (req, res) =>{
        if(!req.body.code){
            log.error("Some parameters not found");

            return res.status(400).json({
                response: {
                    result: null,
                    token: ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const decCode = aesDecryption(req.body.code);

        verificationIdentityOp(decCode, (error, adminId) => {
            if (error) {
                log.error(error);
                return res.status(400).json({
                    response:{
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(error)
                });
            }

            const accessToken = signAccessToken(adminId);
            const refreshToken = signRefreshToken(adminId);

            updatingRefreshToken(adminId, refreshToken, (error2) => {
                if (error2) {
                    log.error(error2);
                    return res.status(400).json({
                        response:{
                            result: null,
                            token: ""
                        },
                        errorMessage: aesEncryption(error)
                    });
                }

                log.debug("Admin verified identity successfully");

                return res.status(200).json({
                    response:{
                        result: aesEncryption(adminId),
                        token: accessToken
                    },
                    errorMessage: ""
                });
            });
        });
    },
        
    resetPassword: (req, res) =>{
        if(!req.body.admin_id || !req.body.new_password){
            log.error("Some parameters not found");

            return res.status(400).json({
                response: {
                    result: null,
                    token: ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const decAdminId = aesDecryption(req.body.admin_id);
        const decNewPassword = hashEncryption(aesDecryption(req.body.new_password));

        resetPasswordOp(decAdminId, decNewPassword, (error) => {
            if (error) {
                log.error(error);
                return res.status(400).json({
                    response:{
                        result: null,
                        token: ""
                    },
                    errorMessage: aesEncryption(error)
                });
            }

            log.debug("Reset password successfully");

            return res.status(200).json({
                response:{
                    result: aesEncryption("Success operation"),
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    } 
       

}