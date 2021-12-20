const pool = require('../../../config/database');


module.exports = {

    getGeneralUsersOp : (pageSize, offset, callBack) => {
        pool.query(
            "SELECT p.id, p.name, per_img.image_path "
            +"FROM person p "
            +"JOIN" 
            +    "(SELECT image_path, person_id "
            +     "FROM photo"
            +    " WHERE personal_type = 1) AS per_img "
            +"ON p.id = per_img.person_id "
            +"WHERE p.lowest_cost = 0 AND p.highest_cost = 0 AND p.verified = 1 AND p.verify_code = 0 AND p.is_admin = 0 "
            +"LIMIT ? "
            +"OFFSET ?",
            [
                parseInt(pageSize, 10),
                parseInt(offset, 10)
            ],
            (error, users, fields) => {
                if (error) {
                    console.log(error);
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, users);
            }
        )
    },

    getUserDetailsProfileOp : (userId, callBack) => {
        pool.query( 
            "SELECT p.id, p.name, p.email, p.phone_num AS phone_number, p.identity_num AS national_number, c.name AS city, p.date_join, req_num.requests_num, per_img.profile_image, iden_img.personal_identity_image, fav.favourites, sear.searchs "

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
                    +"SELECT full_req.user_id, COUNT(full_req.id) AS requests_num "
                    +"FROM " 
                        +"( "
                            +"SELECT re.id, re.user_id, ph.request_id "
                            +"FROM request re "
                            +"LEFT JOIN photo ph "
                            +"ON re.id = ph.request_id "
                        +") AS full_req "
                    +"WHERE full_req.request_id IS NULL "
                    +"GROUP BY full_req.user_id "
                 +") AS req_num "
            +"ON req_num.user_id = p.id "
            
            +"JOIN " 
                +"( "
                   +"SELECT user_id, COUNT(id) AS searchs "
                   +"FROM history "
                   +"GROUP BY user_id "
                 +") AS sear "
            +"ON sear.user_id = p.id "
            
            +"JOIN " 
                +"( "
                   +"SELECT user_id, COUNT(id) AS favourites "
                   +"FROM favourite "
                   +"GROUP BY user_id "
                 +") AS fav "
            +"ON fav.user_id = p.id "
            +"WHERE p.id = ? ",
            [
                userId
            ],
            (error, userProfile, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, userProfile[0]);
            }
        )
    },

    getUserDetailsRequestsOp : (userId, callBack) => {

        pool.query(
            "SELECT r.id, r.name, pr.name AS process, r.start_date, r.end_date, r.total_cost AS cost, " 
            +"r.comment, s.name AS status, r.total_rate AS rating, c.name AS craftman_name "  
            +"FROM request r "
            +"JOIN process pr "
            +"ON pr.id = r.process_id "
            +"JOIN status s "
            +"ON s.id = r.status_id "
            +"JOIN person u "
            +"ON u.id = r.user_id "
            +"JOIN person c "
            +"ON c.id = r.craftman_id "
            +"LEFT JOIN photo ph "
            +"ON r.id = ph.request_id "
            +"WHERE u.id = ? AND ph.request_id IS NULL "
            +"ORDER BY r.id "
            +"LIMIT 10",
            [
                userId
            ],
            (error, requests, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, requests);
            }
        )
    },



    //#region  Get new members operation
    getNewMembersUsersIdsOp : (pageSize, offset, callBack) => {
        pool.query(
            "SELECT id FROM person "
            +"WHERE lowest_cost = 0 AND highest_cost = 0 AND verified = 0 AND verify_code <> 0 AND is_admin = 0 AND is_checked = 0 "
            +"ORDER BY id DESC "
            +"LIMIT ? "
            +"OFFSET ?",
            [
                parseInt(pageSize, 10),
                parseInt(offset, 10)
            ],
            (error, usersIds, fields) => {
                if(error){
                    console.log(error);
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, usersIds);
            }
        )
    },

    getNewMemberUserOp : (userId, callBack) => {
        pool.query(
            "SELECT p.id, p.name, p.email, p.phone_num AS phone_number, p.identity_num AS national_number, c.name AS city, p.date_join, per_img.profile_image, iden_img.personal_identity_image "

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

             +"WHERE p.id = ?",
            [
                userId
            ],
            (error, profile, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, profile[0]);
            }
        )
    },
    //#endregion

    acceptNewMemberUserOp : (userId, callBack) => {
        pool.query(
            "UPDATE person "
            +"SET is_checked = 1 "
            +"WHERE id = ? ",
            [
                userId
            ],
            (error, result, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                }

                pool.query(
                    "SELECT email, verify_code FROM person WHERE id = ?",
                    [
                        userId
                    ],
                    (error2, user, fields2) =>{
                        if(error2){
                            return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                        }
        
                        return callBack(null, user[0].email, user[0].verify_code);
                    }
                );
            }
        );

        
    },

    getRefusedNewMemberUserPhotosOp : (userId, callBack) => {
        pool.query(
            "SELECT image_path "
            +"FROM photo "
            +"WHERE person_id = ? AND personal_type = 1 AND cartificate_type = 0",
            [
                userId
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
                        userId
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

    refuseNewMemberUserOp : (userId, callBack) => {
        pool.query(
            "DELETE FROM photo WHERE person_id = ?",
            [
                userId
            ],
            (error1, result1, fields1) => {
                if (error1) {
                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                }

                pool.query(
                    "DELETE FROM person WHERE id = ?",
                    [
                        userId
                    ],
                    (error2, result2, fields2) =>{
                        if(error2){
                            return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                        }
        
                        return callBack(null);
                    }
                );
            }
        )
    }
}
