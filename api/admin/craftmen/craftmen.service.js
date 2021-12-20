const pool = require('../../../config/database');

module.exports = {

    getGeneralCraftmenOp : (pageSize, offset, callBack) => {
        pool.query(
            "SELECT p.id, p.name, per_img.image_path "
            +"FROM person p "
            +"JOIN " 
            +    "(SELECT image_path, person_id "
            +     "FROM photo"
            +    " WHERE personal_type = 1) AS per_img "
            +"ON p.id = per_img.person_id "
            +"WHERE p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = 1 AND p.verify_code = 0 "
            +"ORDER BY p.id "
            +"LIMIT ? "
            +"OFFSET ?",
            [
                parseInt(pageSize, 10),
                parseInt(offset, 10)
            ],
            (error, craftmen, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, craftmen);
            }
        )
    },

    getCraftmanDetailsProfileOp : (craftmanId, callBack) => {
        pool.query( 
            "SELECT p.id, p.name, p.email, p.phone_num AS phone_number, p.identity_num AS national_number, c.name AS city, p.date_join, l.type AS level, pos.type AS status, p.block_num AS blocks_num, cra_num.crafts_num, cer_num.certifications_num, proj_num.projects_num, req_num.requests_num, p.lowest_cost, p.highest_cost, per_img.profile_image, iden_img.personal_identity_image, fav.users_favourites, sear.users_searchs "

           +" FROM person p "
            +"JOIN "
                +"( "
                    +"SELECT id, name "
                     +"FROM city "
                +") AS c "
            +"ON p.city_id = c.id "
            
            +"JOIN " 
                +"( "
                    +"SELECT image_path AS profile_image, person_id "
                     +"FROM photo "
                     +"WHERE personal_type = 1 "
                +")  AS per_img "
            +"ON P.id = per_img.person_id "
            
            +"JOIN " 
                +"( "
                    +"SELECT image_path AS personal_identity_image, person_id "
                     +"FROM photo "
                     +"WHERE identity_type = 1 "
                +")  AS iden_img "
            +"ON P.id = iden_img.person_id "
            
            +"JOIN " 
                +"( "
                    +"SELECT id AS craftman_id, type "
                    +"FROM level "
                +") AS l "
            +"ON p.level_id = l.craftman_id "
            
            +"JOIN " 
                +"( "
                    +"SELECT craftman_id, COUNT(craft_id) AS crafts_num "
                    +"FROM craft_person "
                     +"GROUP BY craftman_id "
                +") AS cra_num "
            +"ON cra_num.craftman_id = p.id "
            
            +"JOIN " 
                +"( "
                    +"SELECT person_id, COUNT(image_path) AS certifications_num "
                    +"FROM photo "
                    +"WHERE cartificate_type = 1 "
                    +"GROUP BY person_id "
                 +") AS cer_num "
            +"ON cer_num.person_id = p.id "
            
            +"JOIN " 
                +"( "
                    +"SELECT DISTINCT pr.craftman_id, COUNT(ph.request_id) AS projects_num "
                    +"FROM request pr "
                    +"JOIN photo ph "
                    + "ON pr.id = ph.request_id "
                    +"GROUP BY pr.craftman_id "
                    +"ORDER BY pr.craftman_id "
                 +") AS proj_num "
            +"ON proj_num.craftman_id = p.id "
                
            +"JOIN " 
                +"( "
                    +"SELECT full_req.craftman_id, COUNT(full_req.id) AS requests_num "
                    +"FROM " 
                        +"( "
                            +"SELECT re.id, re.craftman_id, ph.request_id "
                            +"FROM request re "
                            +"LEFT JOIN photo ph "
                            +"ON re.id = ph.request_id "
                        +") AS full_req "
                    +"WHERE full_req.request_id IS NULL "
                    +"GROUP BY full_req.craftman_id "
                 +") AS req_num "
            +"ON req_num.craftman_id = p.id "
            
            +"JOIN " 
                +"( "
                   +"SELECT craftman_id, COUNT(id) AS users_searchs "
                   +"FROM history "
                   +"GROUP BY craftman_id "
                 +") AS sear "
            +"ON sear.craftman_id = p.id "
            
            +"JOIN " 
                +"( "
                   +"SELECT craftman_id, COUNT(id) AS users_favourites "
                   +"FROM favourite "
                   +"GROUP BY craftman_id "
                 +") AS fav "
            +"ON fav.craftman_id = p.id "
            
            +"JOIN position_person pos " 
            +"ON pos.id = p.position_person_id "
            
            +"WHERE p.id = ? AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = 1 ",
            [
                craftmanId
            ],
            (error, craftmanProfile, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, craftmanProfile[0]);
            }
        )
    },

    getCraftmanDetailsCraftsOp : (craftmandId, callBack) => {
        pool.query(
            "SELECT ca.name, cr.name AS skill "  
            +"FROM category ca "
            +"JOIN craft cr "
            +"ON ca.id = cr.category_id "
            +"JOIN craft_person cp "
            +"ON cr.id = cp.craft_id "
            +"JOIN person p "
            +"ON cp.craftman_id = p.id "
            +"WHERE p.id = ? AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = 1 ",
            [
                craftmandId
            ],
            (error, craftmanCrafts, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, craftmanCrafts);
            }
        );
    },
    
    getCraftmanDetailsCertificationsOp : (craftmandId, callBack) => {
        pool.query(
            "SELECT ph.image_path "
            +"FROM person p "
            +"JOIN photo ph "
            +"ON p.id = ph.person_id "
            +"WHERE ph.cartificate_type = 1 AND p.id = ? AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = 1 ",
            [
                craftmandId
            ],
            (error, craftmanCert, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, craftmanCert);
            }
        );
    }, 

    getCraftmanDetailsRequestsOp : (craftmandId, callBack) => {

        pool.query(
            "SELECT r.id, r.name, pr.name AS process, r.start_date, r.end_date, r.total_cost AS cost, " 
            +"r.comment, s.name AS status, r.total_rate AS rating, u.name AS user_name "  
            +"FROM request r "
            +"JOIN process pr "
            +"ON pr.id = r.process_id "
            +"JOIN status s "
            +"ON s.id = r.status_id "
            +"JOIN person c "
            +"ON c.id = r.craftman_id "
            +"JOIN person u "
            +"ON u.id = r.craftman_id "
            +"LEFT JOIN photo ph "
            +"ON r.id = ph.request_id "
            +"WHERE c.id = ? AND ph.request_id IS NULL AND c.lowest_cost <> 0 AND c.highest_cost <> 0 AND c.verified = 1 "
            +"ORDER BY r.id "
            +"LIMIT 10",
            [
                craftmandId
            ],
            (error, requests, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, requests);
            }
        )
    },
    
    getCraftmanDetailsProjectsOp : (craftmandId, callBack) => {
        pool.query(
            "SELECT r.id, r.name, pr.name AS process, r.start_date, r.end_date, r.total_cost AS cost, " 
            +"r.comment, s.name AS status, r.total_rate AS rating, ph.image_path, u.name AS user_name "  
            +"FROM request r "
            +"JOIN process pr "
            +"ON pr.id = r.process_id "
            +"JOIN status s "
            +"ON s.id = r.status_id "
            +"JOIN person c "
            +"ON c.id = r.craftman_id "
            +"JOIN person u "
            +"ON u.id = r.user_id "
            +"JOIN photo ph "
            +"ON r.id = ph.request_id "
            +"WHERE c.id = ? AND c.lowest_cost <> 0 AND c.highest_cost <> 0 AND c.verified = 1 "
            +"ORDER BY r.id "
            +"LIMIT 10",
            [
                craftmandId
            ],
            (error, projects, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, projects);
            }
        )
    }, 
    


    //#region  Get new members operation
    getNewMembersCraftmenIdsOp : (pageSize, offset, callBack) => {
        pool.query(
            "SELECT id FROM person "
            +"WHERE lowest_cost <> 0 AND highest_cost <> 0 AND verified = 0 AND is_checked = 0 "
            +"ORDER BY id "
            +"LIMIT ? "
            +"OFFSET ?",
            [
                parseInt(pageSize, 10),
                parseInt(offset, 10)
            ],
            (error, craftmenIds, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, craftmenIds);
            }
        );
    },

    getNewMembersCraftmanProfileOp : (craftmanId, callBack) => {
        pool.query(
            "SELECT p.id, p.name, p.email, p.phone_num AS phone_number, p.identity_num AS national_number, c.name AS city, p.date_join, cra_num.crafts_num, cer_num.certifications_num, p.lowest_cost, p.highest_cost, per_img.profile_image, iden_img.personal_identity_image "

             +"FROM person p "
             +"JOIN " 
                 +"( " 
                     +"SELECT id, name " 
                      +"FROM city " 
                 +") AS c " 
             +"ON p.city_id = c.id "
             
             +"JOIN "  
                 +"( " 
                     +"SELECT image_path AS profile_image, person_id "
                      +"FROM photo "
                      +"WHERE personal_type = 1 "
                 +")  AS per_img "
            +" ON P.id = per_img.person_id "
             
             +"JOIN "  
                 +"( "
                     +"SELECT image_path AS personal_identity_image, person_id "
                      +"FROM photo "
                      +"WHERE identity_type = 1 "
                 +")  AS iden_img "
             +"ON P.id = iden_img.person_id "

             +"JOIN " 
                 +"( "
                     +"SELECT craftman_id, COUNT(craft_id) AS crafts_num "
                     +"FROM craft_person "
                      +"GROUP BY craftman_id "
                 +") AS cra_num "
             +"ON cra_num.craftman_id = p.id "
             
             +"JOIN "
                 +"( "
                     +"SELECT person_id, COUNT(image_path) AS certifications_num "
                     +"FROM photo "
                     +"WHERE cartificate_type = 1 "
                     +"GROUP BY person_id "
                  +") AS cer_num "
            +" ON cer_num.person_id = p.id "
             
             +"WHERE p.id = ? AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND  p.verified <> 1 ",
            [
                craftmanId
            ],
            (error, profile, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, profile[0]);
            }
        )
    },

    getNewMembersCraftmanCraftsOp : (craftmanId, callBack) => {
        pool.query(
            "SELECT ca.name, cr.name AS skill "  
            +"FROM category ca "
            +"JOIN craft cr "
            +"ON ca.id = cr.category_id "
            +"JOIN craft_person cp "
            +"ON cr.id = cp.craft_id "
            +"JOIN person p "
            +"ON cp.craftman_id = p.id "
            +"WHERE p.id = ? AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND  p.verified <> 1 ",
            [
                craftmanId
            ],
            (error, crafts, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, crafts);
            }
        );
    },

    getNewMembersCraftmanCertificationsOp : (craftmanId, callBack) => {
        pool.query(
            "SELECT ph.image_path "
            +"FROM person  p " 
            +"JOIN photo ph " 
            +"ON p.id = ph.person_id "
            +"WHERE ph.cartificate_type = 1 AND p.id = ? AND p.lowest_cost <> 0 AND p.highest_cost <> 0 AND p.verified = 0 ",
            [
                craftmanId
            ],
            (error, Certifications, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, Certifications);
            }
        )
    },
    //#endregion

    acceptNewMemberCraftmanOp : (craftmanId, level, callBack) => {

        pool.query(
            "SELECT id FROM level WHERE type = ?",
            [
                level
            ],
            (error, levelId, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                }

                pool.query(
                    "UPDATE person "
                    +"SET is_checked = 1, level_id = ? "
                    +"WHERE id = ? ",
                    [
                        levelId[0].id,
                        craftmanId
                    ],
                    (error2, result, fields2) => {
                        if (error2) {
                            return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                        }
        
                        pool.query(
                            "SELECT email, verify_code "
                            +"FROM person "
                            +"WHERE id = ? ",
                            [
                                craftmanId
                            ],
                            (error3, craftman, fields3) =>{
                                if(error3){
                                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                                }
                
                                return callBack(null, craftman[0].email, craftman[0].verify_code);
                            }
                        );
                    }
                );
            }
        );

       

        
    },

    getRefusedNewMemberCraftmanPhotosOp : (craftmanId, callBack) => {
        pool.query(
            "SELECT image_path "
            +"FROM photo "
            +"WHERE person_id = ? AND personal_type = 1 AND cartificate_type = 0",
            [
                craftmanId
            ],
            (error, profileImage, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                }
                
                pool.query(
                    "SELECT image_path "
                    +"FROM photo "
                    +"WHERE person_id = ? AND identity_type = 1 AND cartificate_type = 0",
                    [
                        craftmanId
                    ],
                    (error2, personalIdentityImage, fields2) => {
                        if(error2){
                            return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                        }

                        return callBack(null, profileImage[0].image_path, personalIdentityImage[0].image_path);
                    }
                );
            }
        );
    },

    refuseNewMemberCraftmanOp : (craftmanId, callBack) => {
        pool.query(
            "DELETE FROM photo WHERE person_id = ?",
            [
                craftmanId
            ],
            (error1, result1, fields1) => {
                if (error1) {
                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                }

                pool.query(
                    "DELETE FROM person WHERE id = ?",
                    [
                        craftmanId
                    ],
                    (error2, result2, fields2) =>{
                        if(error2){
                            return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                        }
        
                        return callBack(null);
                    }
                );
            }
        );
    },

    




    getBlockingFiringsCraftmenNumberOP : (callBack) => {
        pool.query(
            "SELECT full_bloc.blocking_num, full_fir.firing_num "
            +"FROM " 
                +"( "
                    +"SELECT COUNT(bloc.craftman_id) AS blocking_num "
                    +"FROM " 
                        +"( "
                            +"SELECT r.craftman_id "
                            +"FROM report r "
                            +"JOIN person p "
                            +"ON p.id = r.craftman_id "
                            +"WHERE p.block_num < 2 "
                            +"GROUP BY r.craftman_id "
                            +"HAVING COUNT(r.id) >= 10 "
                        +") AS bloc "
                +") AS full_bloc, "
                +"( "
                   + "SELECT COUNT(fir.craftman_id) AS firing_num "
                   +" FROM "
                        +"( "
                             +"SELECT r.craftman_id "
                           +" FROM report r "
                            +"JOIN person p "
                            +"ON p.id = r.craftman_id "
                            +"WHERE p.block_num = 2 "
                            +"GROUP BY r.craftman_id "
                           +" HAVING COUNT(r.id) >= 10 "
                        +") AS fir "
                +") AS full_fir ",
            [],
            (error, result, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, result[0]);
            }
        )
    },


    getReportedBlockingCraftmenIdsOp : (pageSize, offset, callBack) => {
        pool.query(
            "SELECT r.craftman_id "
            +"FROM report r "
            +"JOIN person p "
            +"ON p.id = r.craftman_id "
            +"WHERE p.block_num < 2 AND r.is_checked = 0 "
            +"GROUP BY r.craftman_id "
            +"HAVING COUNT(p.id) >= 10 "
            +"LIMIT ? "
            +"OFFSET ?",
            [
                parseInt(pageSize, 10),
                parseInt(offset, 10)
            ],
            (error, result, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, result);
            }
        )
    },

    getReportedFiringCraftmenIdsOp : (pageSize, offset, callBack) => {
        pool.query(
            "SELECT r.craftman_id "
            +"FROM report r "
            +"JOIN person p "
            +"ON p.id = r.craftman_id "
            +"WHERE p.block_num = 2 AND r.is_checked = 0 "
            +"GROUP BY r.craftman_id "
            +"HAVING COUNT(p.id) >= 10 "
            +"LIMIT ? "
            +"OFFSET ?",
            [
                parseInt(pageSize, 10),
                parseInt(offset, 10)
            ],
            (error, result, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, result);
            }
        )
    },

    getReportedCraftmanInfo : (craftmandId, callBack) => {
        pool.query(
            "SELECT p.id, p.name, ph.image_path AS profile_image "
            +"FROM person p "
            +"JOIN photo ph "
            +"ON p.id = ph.person_id "
            +"WHERE p.id = ? AND ph.personal_type = 1 ",
            [
                craftmandId
            ],
            (error, craftmanInfo, fields) => {
                if(error){
                    console.log(error)
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, craftmanInfo[0]);
            }
        );
    },

    getReportedCraftmanReports : (craftmandId, callBack) => {
        pool.query(
            "SELECT r.id AS request_id, u.name AS user_name, r.speed, r.dealing, r.price, r.lates, r.context AS comment "
            +"FROM report r "
            +"JOIN person c "
            +"ON c.id = r.craftman_id "
            +"JOIN person u "
            +"ON u.id = r.user_id "
            +"WHERE c.id = ? "
            +"LIMIT 10",
            [
                craftmandId
            ],
            (error, reports, fields) => {
                if(error){
                    console.log(error)
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, reports);
            }
        );
    },


    blockingCraftmanOp : (craftmanId, blockingStartDate, blockingEndDate, callBack) => {
        pool.query(
            "SELECT block_num "
            +"FROM person "
            +"WHERE id = ?",
            [
                craftmanId
            ],
            (error, result, fields) =>{
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                }

                pool.query(
                    "UPDATE person " 
                    +"SET block_start_date = ?, block_end_date = ?, block_num = ? "
                    +"WHERE id = ? ",
                    [
                        blockingStartDate,
                        blockingEndDate,
                        result[0].block_num + 1,
                        craftmanId
                    ],
                    (error2, result2, fields2) =>{
                        if(error2) {
                            return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                        }
                        
                        pool.query(
                            "UPDATE report "
                            +"SET is_checked = 1 " 
                            +"WHERE craftman_id = ? ",
                            [
                                craftmanId
                            ],
                            (error3, result3, fields3) => {
                                if(error3){
                                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                                }

                                return callBack(null)
                            }
                        );
                    }
                );
            }
        );
    },

    getRefusedCraftmanImagesOp : (craftmandId, callBack) => {
        pool.query(
            "SELECT image_path FROM photo WHERE person_id = ? AND cartificate_type = 0 AND identity_type = 0 AND personal_type = 0 ",
            [
                craftmandId
            ],
            (error, result, fields) =>{
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                }

                return callBack(null, result);
            }
        );
    },

    firingCraftmanOp : (craftmanId, blockStartDate, blockEndDate, callBack) => {
        pool.query(
            "DELETE FROM photo WHERE person_id = ? AND cartificate_type = 0 AND identity_type = 0 AND personal_type = 0 ",
            [
                craftmanId
            ],
            (error0, result, fields) => {
                if(error0){
                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                }

                pool.query(
                    "SELECT block_num "
                    +"FROM person "
                    +"WHERE id = ?",
                    [
                        craftmanId
                    ],
                    (error, result2, fields2) =>{
                        if(error){
                            return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                        }
        
                        pool.query(
                            "UPDATE person "
                            +"SET block_start_date = ?, block_end_date = ?, block_num = ?"
                            +"WHERE id = ?",
                            [
                                blockStartDate,
                                blockEndDate,
                                result[0].block_num + 1,
                                craftmanId
                            ],
                            (error2, result3, fields3) =>{
                                if(error2){
                                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                                }

                                pool.query(
                                    "UPDATE report "
                                    +"SET is_checked = 1 " 
                                    +"WHERE craftman_id = ? ",
                                    [
                                        craftmanId
                                    ],
                                    (error3, result4, fields4) => {
                                        if (error3) {
                                            return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                                        }

                                        return callBack(null);
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
}

