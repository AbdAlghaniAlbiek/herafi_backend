
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const {
    LoggerService,
    appType
} = require('../../../services/logging');
const {
    getGeneralCraftmenOp,
    getCraftmanDetailsProfileOp,
    getCraftmanDetailsCraftsOp,
    getCraftmanDetailsCertificationsOp,
    getCraftmanDetailsRequestsOp,
    getCraftmanDetailsProjectsOp, 

    getNewMembersCraftmenIdsOp,
    getNewMembersCraftmanProfileOp,
    getNewMembersCraftmanCraftsOp,
    getNewMembersCraftmanCertificationsOp,
    acceptNewMemberCraftmanOp,
    refuseNewMemberCraftmanOp,
    getRefusedNewMemberCraftmanPhotosOp,


    
    getReportedCraftmanInfo,
    getReportedCraftmanReports,
    blockingCraftmanOp,
    firingCraftmanOp,
    getReportedBlockingCraftmenIdsOp,
    getBlockingFiringsCraftmenNumberOP, 
    getReportedFiringCraftmenIdsOp,
    getRefusedCraftmanImagesOp
} = require('./craftmen.service');
const {
    aesDecryption,
    aesEncryption
} = require('../../../security/aes_algorithm');
const {
    sendMail
} = require('../../../services/mailing');

const log = new LoggerService("craftmen", appType.admin, false);

module.exports = {

    getGeneralCraftmen: (req, res) => {
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

        const decPageSize = aesDecryption(req.query.page_size);
        const decOffset = aesDecryption(req.query.offset);
        
        getGeneralCraftmenOp(decPageSize, decOffset, (error, craftmen) => {
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

            for (let i = 0; i < craftmen.length; i++) {
                craftmen[i].id = aesEncryption(craftmen[i].id.toString());
                craftmen[i].name = aesEncryption(craftmen[i].name.toString());
                craftmen[i].image_path = aesEncryption(craftmen[i].image_path.toString());
            }

            log.debug("Success operation")
            return res.status(200).json({
                response: {
                    result: craftmen,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getCraftmanDetailsProfile: (req, res) => {
        if (!req.query.craftman_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const craftmanId = aesDecryption(req.query.craftman_id.toString().replace(/ /g, "+"));

        getCraftmanDetailsProfileOp(craftmanId, (error, craftmanProfile) => {
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

            craftmanProfile.id = aesEncryption(craftmanProfile.id.toString());
            craftmanProfile.name = aesEncryption(craftmanProfile.name.toString());
            craftmanProfile.email = aesEncryption(craftmanProfile.email.toString());
            craftmanProfile.phone_number = aesEncryption(craftmanProfile.phone_number.toString());
            craftmanProfile.national_number = aesEncryption(craftmanProfile.national_number.toString());
            craftmanProfile.city = aesEncryption(craftmanProfile.city.toString());
            craftmanProfile.date_join = aesEncryption(
                moment(craftmanProfile.date_join).year() !== 1899 ? moment(craftmanProfile.date_join).format("YYYY-MM-DD") : '0000-00-00');
            craftmanProfile.level = aesEncryption(craftmanProfile.level.toString());
            craftmanProfile.status = aesEncryption(craftmanProfile.status.toString());
            craftmanProfile.blocks_num = aesEncryption(craftmanProfile.blocks_num.toString());
            craftmanProfile.crafts_num = aesEncryption(craftmanProfile.crafts_num.toString());
            craftmanProfile.certifications_num = aesEncryption(craftmanProfile.certifications_num.toString());
            craftmanProfile.projects_num = aesEncryption(craftmanProfile.projects_num.toString());
            craftmanProfile.requests_num = aesEncryption(craftmanProfile.requests_num.toString());
            craftmanProfile.lowest_cost = aesEncryption(craftmanProfile.lowest_cost.toString());
            craftmanProfile.highest_cost = aesEncryption(craftmanProfile.highest_cost.toString());
            craftmanProfile.profile_image = aesEncryption(craftmanProfile.profile_image.toString());
            craftmanProfile.personal_identity_image = aesEncryption(craftmanProfile.personal_identity_image.toString());
            craftmanProfile.users_favourites = aesEncryption(craftmanProfile.users_favourites.toString());
            craftmanProfile.users_searchs = aesEncryption(craftmanProfile.users_searchs.toString());

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: craftmanProfile,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: "" 
            });

        });
    },

    getCraftmanDetailsCrafts: (req, res) => {
        if (!req.query.craftman_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const craftmanId = aesDecryption(req.query.craftman_id.toString().replace(/ /g, "+"));

        getCraftmanDetailsCraftsOp(craftmanId, (error, craftmanCrafts) => {
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

            let newcraftmanCrafts = new Array();
            let isNewName;
            for (let i = 0; i < craftmanCrafts.length; i++) {
                
                if (i === 0) {
                    newcraftmanCrafts.push({
                        name: craftmanCrafts[i].name,
                        skills: new Array(craftmanCrafts[i].skill) 
                    }); 
                }
                else{
                    isNewName = true;
                    for (let j = 0; j < newcraftmanCrafts.length; j++) {
                        if (craftmanCrafts[i].name === newcraftmanCrafts[j].name) {
                            newcraftmanCrafts[j].skills.push(craftmanCrafts[i].skill);
                            isNewName = false;
                            break;
                        }
                    }

                    if(isNewName === true){
                        newcraftmanCrafts.push({
                            name: craftmanCrafts[i].name,
                            skills: new Array(craftmanCrafts[i].skill)
                        });
                    }
                }
            }

            for (let i = 0; i < newcraftmanCrafts.length; i++) {
                newcraftmanCrafts[i].name = aesEncryption(newcraftmanCrafts[i].name.toString());
                
                for (let j = 0; j < newcraftmanCrafts[i].skills.length; j++) {
                    newcraftmanCrafts[i].skills[j] = 
                        aesEncryption(newcraftmanCrafts[i].skills[j].toString());
                }
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: newcraftmanCrafts,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: "" 
            });
        });
    },

    getCraftmanDetailsCertifications: (req, res) => {
        if (!req.query.craftman_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const craftmanId = aesDecryption(req.query.craftman_id).toString().replace(/ /g, "+");

        getCraftmanDetailsCertificationsOp(craftmanId, (error, craftmanCert) => {
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

            let newCraftmanCert = new Array();
            for (let i = 0; i < craftmanCert.length; i++) {
                newCraftmanCert.push(aesEncryption(craftmanCert[i].image_path.toString()));
            }

            log.error("Success operation");
            return res.status(200).json({
                response: {
                    result: newCraftmanCert,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            }); 
        });
    },

    getCraftmanDetailsRequests: (req, res) => {
        if (!req.query.craftman_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found".toString()) 
            });
        }

        let craftmanId = aesDecryption(req.query.craftman_id.toString().replace(/ /g, "+"));
        
        getCraftmanDetailsRequestsOp(craftmanId, (error, requests) => {
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
                requests[i].user_name = aesEncryption(requests[i].user_name.toString());
                requests[i].process = aesEncryption(requests[i].process.toString());
                requests[i].start_date = aesEncryption(
                        moment(requests[i].start_date).year() !== 1899 ?moment(requests[i].start_date).format('YYYY-MM-DD'): '0000-00-00');
                requests[i].end_date = aesEncryption(
                        moment(requests[i].end_date).year() !== 1899 ?moment(requests[i].end_date).format('YYYY-MM-DD'): '0000-00-00');
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

    getCraftmanDetailsProjects: (req, res) => {
        if (!req.query.craftman_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        let craftmanId = aesDecryption(req.query.craftman_id.toString().replace(/ /g, "+"));
        
        getCraftmanDetailsProjectsOp(craftmanId, (error, projects) => {
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

            /* example:
            temp = [
                 {
                    id : 1,
                    images :[
                        "../../..///imagePath",
                        "../../..///imagePath"
                    ] 
                },
                {
                    id : 2,
                    images :[
                        "../../..///imagePath",
                        "../../..///imagePath"
                    ] 
                }
            ]
            */
            let temp = new Array();
            let newId;
            for (let i = 0; i < projects.length; i++) {
                if (i === 0) {
                    temp.push({
                        id: projects[i].id,
                        images: new Array(projects[i].image_path)
                    });
                }
                else{
                    newId = true;
                    for (let j = 0; j < temp.length; j++) {
                        if (projects[i].id === temp[j].id) {
                            temp.images.push(projects[i].image_path);
                            newId = false;
                            break;
                        }
                    }
                    
                    if(newId){
                        temp.push({
                            id: projects[i].id,
                            images: new Array(projects[i].image_path)
                        });
                    }
                }
            }

            let newProjects = new Array();
            let k = 0;
            for (let i = 0; i < projects.length; i++) {
                if(i === 0){
                    newProjects.push({
                        id: projects[i].id,
                        name: projects[i].name,
                        process: projects[i].process,
                        start_date: projects[i].start_date,
                        end_date: projects[i].end_date,
                        cost: projects[i].cost,
                        comment: projects[i].comment,
                        status: projects[i].status,
                        rating: projects[i].rating,
                        user_name: projects[i].user_name,
                        project_images : temp[i].images
                    });
                }
                else{
                    newId = true;
                    for (let j = 0; j < newProjects.length; j++) {
                        if (projects[i].id === newProjects[j].id) {
                            newId = false;
                            break;
                        }
                    }

                    if (newId) {
                        for (let j = 0; j < temp.length; j++) {
                            if (temp[j].id === projects[i].id) {
                                newProjects.push({
                                    id: projects[i].id,
                                    name: projects[i].name,
                                    process: projects[i].process,
                                    start_date: projects[i].start_date,
                                    end_date: projects[i].end_date,
                                    cost: projects[i].cost,
                                    comment: projects[i].comment,
                                    status: projects[i].status,
                                    rating: projects[i].rating,
                                    user_name: projects[i].user_name,
                                    project_images : temp[j].images
                                });
                                break;
                            }
                        }
                    }
                }
            }


            for (let i = 0; i < newProjects.length; i++) {
                newProjects[i].id = aesEncryption(newProjects[i].id.toString());
                newProjects[i].name = aesEncryption(newProjects[i].name.toString());
                newProjects[i].user_name = aesEncryption(newProjects[i].user_name.toString());
                newProjects[i].process = aesEncryption(newProjects[i].process.toString());
                newProjects[i].start_date = aesEncryption(
                    moment(newProjects[i].start_date).year() !== 1899 ? moment(newProjects[i].start_date).format("YYYY-MM-DD") : '0000-00-00');
                newProjects[i].end_date = aesEncryption(
                    moment(newProjects[i].end_date).year() !== 1899 ? moment(newProjects[i].end_date).format("YYYY-MM-DD") : '0000-00-00');
                newProjects[i].cost = aesEncryption(newProjects[i].cost.toString());
                newProjects[i].comment = aesEncryption(newProjects[i].comment.toString());
                newProjects[i].status = aesEncryption(newProjects[i].status.toString());
                newProjects[i].rating = aesEncryption(newProjects[i].rating.toString());
                
                for (let j = 0; j < newProjects[i].project_images.length; j++) {
                    newProjects[i].project_images[j] =  aesEncryption(newProjects[i].project_images[j]);
                }
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: newProjects,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },



    //#region Get new members process
    getNewMembersCraftmenIds: (req, res) => {
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

        const decPageSize = aesDecryption(req.query.page_size);
        const decOffset = aesDecryption(req.query.offset);

        getNewMembersCraftmenIdsOp(decPageSize, decOffset, (error, craftmenIds) => {
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
            
            //Modifying
            let newCraftmenIds = new Array();
            for (let i = 0; i < craftmenIds.length; i++) {
                newCraftmenIds.push(craftmenIds[i].id);
            }
            
            //Encryption
            for (let i = 0; i < newCraftmenIds.length; i++) {
                newCraftmenIds[i] = aesEncryption(newCraftmenIds[i].toString());
            }

            return res.status(200).json({
                response: {
                    result: newCraftmenIds,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getNewMemberCraftman: (req, res) => {
        if (!req.query.craftman_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const craftmanId = aesDecryption(req.query.craftman_id.toString().replace(" ", "+"));
        let newMemberCraftman;
        let newCraftmanProfile;
        let newcraftmanCrafts = new Array();
        let newcraftmanCert = new Array();

        getNewMembersCraftmanProfileOp(craftmanId, (error, craftmanProfile) => {
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

            newCraftmanProfile = craftmanProfile

            getNewMembersCraftmanCraftsOp(craftmanId, (error2, craftmanCrafts) => {
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

                let isNewName;
                for (let i = 0; i < craftmanCrafts.length; i++) {
        
                    if (i === 0) {
                        newcraftmanCrafts.push({
                            name: craftmanCrafts[i].name,
                            skills: new Array(craftmanCrafts[i].skill)
                        });
                    }
                    else{
                        isNewName = true;
                        for (let j = 0; j < newcraftmanCrafts.length; j++) {
                            if (craftmanCrafts[i].name === newcraftmanCrafts[j].name) {
                                newcraftmanCrafts[j].skills.push(craftmanCrafts[i].skill);
                                isNewName = false;
                                break;
                            }
                        }
        
                        if(isNewName === true){
                            newcraftmanCrafts.push({
                                name: craftmanCrafts[i].name,
                                skills: new Array(craftmanCrafts[i].skill)
                            });
                        }
                    }
                }

                getNewMembersCraftmanCertificationsOp(craftmanId, (error3, craftmanCert) => {
                    if (error3) {
                        log.error(error3);
                        return res.status(400).json({
                            response: {
                                result: null,
                                token: req.accessToken ? req.accessToken : ""
                            },
                            errorMessage: aesEncryption(error3) 
                        });
                    }


                    for (let i = 0; i < craftmanCert.length; i++) {
                        newcraftmanCert.push(craftmanCert[i].image_path)
                    }

                    newMemberCraftman = {
                        profile: newCraftmanProfile,
                        crafts: newcraftmanCrafts,
                        certifications: newcraftmanCert
                    };

                    //******* Encryption *********
                    newMemberCraftman.profile.id = aesEncryption(newMemberCraftman.profile.id.toString());
                    newMemberCraftman.profile.name = aesEncryption(newMemberCraftman.profile.name.toString());
                    newMemberCraftman.profile.email = aesEncryption(newMemberCraftman.profile.email.toString());
                    newMemberCraftman.profile.phone_number = aesEncryption(newMemberCraftman.profile.phone_number.toString());
                    newMemberCraftman.profile.national_number = aesEncryption(newMemberCraftman.profile.national_number.toString());
                    newMemberCraftman.profile.city = aesEncryption(newMemberCraftman.profile.city.toString());
                    newMemberCraftman.profile.date_join = aesEncryption(
                        moment(newMemberCraftman.profile.date_join).year() !== 1899 ? moment(newMemberCraftman.profile.date_join).format("YYYY-MM-DD") : '0000-00-00');
                    newMemberCraftman.profile.crafts_num = aesEncryption(newMemberCraftman.profile.crafts_num.toString());
                    newMemberCraftman.profile.certifications_num = aesEncryption(newMemberCraftman.profile.certifications_num.toString());
                    newMemberCraftman.profile.lowest_cost = aesEncryption(newMemberCraftman.profile.lowest_cost.toString());
                    newMemberCraftman.profile.highest_cost = aesEncryption(newMemberCraftman.profile.highest_cost.toString());
                    newMemberCraftman.profile.profile_image = aesEncryption(newMemberCraftman.profile.profile_image.toString());
                    newMemberCraftman.profile.personal_identity_image = aesEncryption(newMemberCraftman.profile.personal_identity_image.toString());

                    for (let i = 0; i < newMemberCraftman.crafts.length; i++) {
                        newMemberCraftman.crafts[i].name = 
                            aesEncryption(newMemberCraftman.crafts[i].name.toString());

                        for (let j = 0; j < newMemberCraftman.crafts[i].skills.length; j++) {
                            newMemberCraftman.crafts[i].skills[j] = 
                                aesEncryption(newMemberCraftman.crafts[i].skills[j].toString());
                        }
                    }

                    for (let i = 0; i < newMemberCraftman.certifications.length; i++) {
                        newMemberCraftman.certifications[i] = aesEncryption(newMemberCraftman.certifications[i].toString());
                    }


                    log.debug("Success operation");
                    return res.status(200).json({
                        response: {
                            result: newMemberCraftman,
                            token: req.accessToken ? req.accessToken : ""
                        },
                        errorMessage: ""
                    });
                });
            });
        });
    },
    //#endregion

    acceptNewMemberCraftman: (req, res) => {
        if (!req.query.craftman_id || !req.query.level) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const craftmandId = aesDecryption(req.query.craftman_id.toString().replace(/ /g, "+"));
        const level = aesDecryption(req.query.level.toString().replace(/ /g, "+"));
        
        acceptNewMemberCraftmanOp(craftmandId, level, (error, email, verifyCode) => {
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

    refuseNewMemberCraftman: (req, res) => {
        if (!req.query.craftman_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const craftmandId = aesDecryption(req.query.craftman_id.toString().replace(/ /g, "+"));

        getRefusedNewMemberCraftmanPhotosOp(craftmandId, (error, profileImage, personalIdentityImage) => {
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

            fs.unlink("public/upload/images/craftmen/" + personalIdentityImage, (err) => {
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

               fs.unlink("public/upload/images/craftmen/" + profileImage, (err2) => {
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
                
                    refuseNewMemberCraftmanOp(craftmandId, (error3) => {
                        if (error3) {
                            log.error(error3);
                            return res.status(400).json({
                                response: {
                                    result: null,
                                    token: req.accessToken ? req.accessToken : ""
                                },
                                errorMessage: aesEncryption(error3) 
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
    },

    


    getBlockingFiringsCraftmenNumber : (req, res) =>{

        getBlockingFiringsCraftmenNumberOP((error, blocFirNumbers) => {
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

            blocFirNumbers.blocking_num = aesEncryption(blocFirNumbers.blocking_num.toString());
            blocFirNumbers.firing_num = aesEncryption(blocFirNumbers.firing_num.toString());

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: blocFirNumbers,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        })
    },

    getReportedBlockingCraftmenIds : (req, res) =>{
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

        const decPageSize = aesDecryption(req.query.page_size);
        const decOffset = aesDecryption(req.query.offset);

        getReportedBlockingCraftmenIdsOp(decPageSize, decOffset, (error, craftmenIds) => {
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

            let newCraftmenIds = new Array();
            for (let i = 0; i < craftmenIds.length; i++) {
                 newCraftmenIds.push(craftmenIds[i].craftman_id);
            }

            for (let i = 0; i < newCraftmenIds.length; i++) {
                newCraftmenIds[i] = aesEncryption(newCraftmenIds[i].toString());
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: newCraftmenIds,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getReportedFiringCraftmenIds : (req, res) =>{
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

        const decPageSize = aesDecryption(req.query.page_size);
        const decOffset = aesDecryption(req.query.offset);

        getReportedFiringCraftmenIdsOp(decPageSize, decOffset, (error, craftmenIds) => {
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

            let newCraftmenIds = new Array();
            for (let i = 0; i < craftmenIds.length; i++) {
                 newCraftmenIds.push(craftmenIds[i].craftman_id);
            }

            for (let i = 0; i < newCraftmenIds.length; i++) {
                newCraftmenIds[i] = aesEncryption(newCraftmenIds[i].toString());
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: newCraftmenIds,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getReportedCraftman : (req, res) => {
        if (!req.query.craftman_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const craftmanId = aesDecryption(req.query.craftman_id.toString().replace(/ /g, "+"));
        let tempReportedCraftman;

        getReportedCraftmanInfo(craftmanId, (error, reportedCraftman) => {
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

            tempReportedCraftman = reportedCraftman;

            getReportedCraftmanReports(craftmanId, (error2, reports) => {
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

                let problems;
                let newReports = new Array();

                for (let i = 0; i < reports.length; i++) {
                    problems = new Array();
                    problems.push(reports[i].speed === 1 ? "Speed" : "___");
                    problems.push(reports[i].dealing === 1 ? "Dealing" : "___");
                    problems.push(reports[i].price === 1 ? "Price" : "___");
                    problems.push(reports[i].lates === 1 ? "Lates" : "___");

                    newReports.push({
                        number : i + 1,
                        user_name : reports[i].user_name,
                        request_id : reports[i].request_id,
                        comment: reports[i].comment,
                        problems : problems
                    });
                }

                let newReportedCraftman = {
                    id: tempReportedCraftman.id,
                    name: tempReportedCraftman.name,
                    profile_image: tempReportedCraftman.profile_image,
                    reports: newReports
                };

                newReportedCraftman.id = aesEncryption(newReportedCraftman.id.toString());
                newReportedCraftman.name = aesEncryption(newReportedCraftman.name.toString());
                newReportedCraftman.profile_image = aesEncryption(newReportedCraftman.profile_image.toString());
           
                for (let i = 0; i < newReportedCraftman.reports.length; i++) {
                    newReportedCraftman.reports[i].comment = aesEncryption(newReportedCraftman.reports[i].comment.toString())
                    newReportedCraftman.reports[i].number = aesEncryption(newReportedCraftman.reports[i].number.toString())
                    newReportedCraftman.reports[i].user_name = aesEncryption(newReportedCraftman.reports[i].user_name.toString());
                    newReportedCraftman.reports[i].request_id = aesEncryption(newReportedCraftman.reports[i].request_id.toString());

                    for (let j = 0; j < newReportedCraftman.reports[j].problems.length; j++) {
                        newReportedCraftman.reports[i].problems[j] = aesEncryption(newReportedCraftman.reports[i].problems[j].toString());
                    }
                }
    
                log.debug("Success operation");
                return res.status(200).json({
                    response: {
                        result: newReportedCraftman,
                        token: req.accessToken ? req.accessToken : ""
                    },
                    errorMessage: ""
                });
            });
        })
    },

    blockingCraftman : (req, res) => {
        if (!req.query.craftman_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        } 

        const craftmandId = aesDecryption(req.query.craftman_id.toString().replace(/ /g, "+"));
       
        let startBlockingDate = new Date();
        startBlockingDate.setFullYear(startBlockingDate.getFullYear(), startBlockingDate.getMonth(), startBlockingDate.getDate());


        let endBlockingDate = new Date();

        if (endBlockingDate.getMonth() !== 2) {
            //Month 4, 6, 8, 10, 12
            if (endBlockingDate.getMonth() % 2 === 0) {
                if (endBlockingDate.getDate() + 10 > 30) {
                    if (endBlockingDate.getMonth() === 12) {
                        endBlockingDate.setFullYear(endBlockingDate.getFullYear() + 1, 1, 10 - (30 - endBlockingDate.getDate()));
                    }
                    else{
                        endBlockingDate.setFullYear(endBlockingDate.getFullYear(), endBlockingDate.getMonth() + 1, 10 - (30 - endBlockingDate.getDate()));
                    }
                }
                else{
                    endBlockingDate.setFullYear(endBlockingDate.getFullYear(), endBlockingDate.getMonth(), endBlockingDate.getDate() + 10);
                }
            }
            //Month 1, 3, 5, 7, 9, 11
            else if (endBlockingDate.getMonth() % 2 !== 0){
                if(endBlockingDate.getDate() + 10 > 31){
                    endBlockingDate.setFullYear(endBlockingDate.getFullYear(), endBlockingDate.getMonth() + 1, 10 - (31 - endBlockingDate.getDate()))
                }
                else{
                    endBlockingDate.setFullYear(endBlockingDate.getFullYear(), endBlockingDate.getMonth(), endBlockingDate.getDate() + 10)
                }
            }
        }
        //Month 2
        else{
            if (endBlockingDate.getFullYear() % 4 === 0) {
                if(endBlockingDate.getDate() + 10 > 29){
                    endBlockingDate.setFullYear(endBlockingDate.getFullYear(), endBlockingDate.getMonth() + 1, 10 - (29 - endBlockingDate.getDate()))
                }
                else{
                    endBlockingDate.setFullYear(endBlockingDate.getFullYear(), endBlockingDate.getMonth(), endBlockingDate.getDate() + 10)
                }
            }
            else{
                if(endBlockingDate.getDate() + 10 > 28){
                    endBlockingDate.setFullYear(endBlockingDate.getFullYear(), endBlockingDate.getMonth() + 1, 10 - (28 - endBlockingDate.getDate()))
                }
                else{
                    endBlockingDate.setFullYear(endBlockingDate.getFullYear(), endBlockingDate.getMonth(), endBlockingDate.getDate() + 10)
                }
            }
        }

        blockingCraftmanOp(craftmandId, startBlockingDate, endBlockingDate, (error) => {
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

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: aesEncryption("Success"),
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        })
    },

    firingCraftman : (req, res) => {
        if (!req.query.craftman_id) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        } 

        const craftmanId = aesDecryption(req.query.craftman_id.toString().replace(/ /g, "+"));
       
        getRefusedCraftmanImagesOp(craftmanId, (error, images) => {
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

            let newImages = new Array();
            for (let i = 0; i < images.length; i++) {
                newImages.push(images[i].image_path);
            }

            Promise.all(
                newImages.map(
                    image => 
                        new Promise((res2, rej) => {
                            try{
                                fs.unlink("public/upload/images/craftmen/" + image, (err) => {
                                    if(err){
                                        log.error(error);
                                        return res2.status(400).json({
                                            response: {
                                                result: null,
                                                token: req.accessToken ? req.accessToken : ""
                                            },
                                            errorMessage: aesEncryption(error) 
                                        });
                                    }
                                });
                            }
                            // eslint-disable-next-line node/no-unsupported-features/es-syntax
                            catch (ex){
                                if(ex){
                                    log.error("Un expected error");
                                    return res2.status(400).json({
                                        response: {
                                            result: null,
                                            token: req.accessToken ? req.accessToken : ""
                                        },
                                        errorMessage: aesEncryption("Un expected error") 
                                    });
                                }
                            }
                        })
                )
            );

            let startDate = new Date(); 
            startDate.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDay());

            firingCraftmanOp(craftmanId, startDate, new Date("2400-01-01"),  (error2) => {
                if(error2){
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
    },
}