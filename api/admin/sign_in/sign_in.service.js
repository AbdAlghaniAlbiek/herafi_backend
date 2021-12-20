const pool = require('../../../config/database');
const {
    hashVerify
} = require('../../../security/hash_algorithm');

module.exports = {

    getCitiesOp: (callBack) => {
        pool.query("SELECT id, name FROM city",
        [],
        (error, result, fields) => {
            if(error){
                return callBack('Error in mysql settings or the request on your query is time out or query is invalid');
            }

            return callBack(null, result);
        })
    },


    signUpAdminOp: (admin, verifyCode, callBack) => {
        pool.query(
            "SELECT email FROM person WHERE email=?",
            [
                admin.email
            ],
            (error, adminEmail, fields) =>{
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                }
                if(adminEmail.length === 1){
                    return callBack("Some one has the same email please enter another one");
                }

                pool.query(
                    "insert into person(name, email, password, date_join, phone_num, identity_num, city_id, verify_code, is_admin) values(?,?,?,NOW(),?,?,?,?,?)",
                    [
                        admin.name,
                        admin.email,
                        admin.password,
                        admin.phone_number,
                        admin.national_number,
                        admin.city_id,
                        verifyCode,
                        1
                    ],
                    (error2, results, fields2) => {
                        if(error2){
                            return callBack("Error in mysql settings or the request on your query is time out or query is invalid2");
                        }

                        return callBack(null);
                    }
                );
            });
    },

    requestFacebookIdOp: () => {
    },

    signUpWithFacebookIdOp: (admin, callBack) => {
        pool.query(
            "SELECT email FROM person WHERE email= ?",
            [
                admin.email
            ],
            (error, adminEmail, fields) =>{
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                }
                if(adminEmail.length === 1){
                    return callBack("Some one has the same email please enter another one");
                }

                pool.query(
                    "insert into person(name, email, password, date_join, phone_num, identity_num, city_id, facebook_id, verify_code, verified, is_admin) values(?,?,?,NOW(),?,?,?,?,?,?,?)",
                    [
                        admin.name,
                        admin.email,
                        admin.password,
                        admin.phoneNumber,
                        admin.nationalNumber,
                        admin.city,
                        admin.facebookId,
                        0,
                        1,
                        1
                    ],
                    (error3, results, fields3) => {
                        if(error3){
                            return callBack("Error in mysql settings or the request on your query is time out or query is invalid2");
                        }

                       pool.query(
                           "SELECT id FROM person WHERE email = ?",
                           [
                               admin.email
                           ],
                           (error4, adminId, fields4) => {
                                if(error4){
                                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid2");
                                }

                                return callBack(null, adminId[0].id);
                           }
                       );
                    }
                );
            }
        );
    },


    requestMicrosoftIdOp: () => {
    },

    signUpWithMicrosoftIdOp: (admin, callBack) => {
        pool.query(
            "SELECT email FROM person WHERE email= ?",
            [
                admin.email
            ],
            (error, adminEmail, fields) =>{
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                }
                if(adminEmail.length === 1){
                    return callBack("Some one has the same email please enter another one");
                }

                pool.query(
                    "insert into person(name, email, password, date_join, phone_num, identity_num, city_id, microsoft_id, verify_code, verified, is_admin) values(?,?,?,NOW(),?,?,?,?,?,?,?)",
                    [
                        admin.name,
                        admin.email,
                        admin.password,
                        admin.phoneNumber,
                        admin.nationalNumber,
                        admin.city,
                        admin.microsoftId,
                        0,
                        1,
                        1
                    ],
                    (error3, results, fields3) => {
                        if(error3){
                            return callBack("Error in mysql settings or the request on your query is time out or query is invalid2");
                        }

                       pool.query(
                           "SELECT id FROM person WHERE email = ?",
                           [
                               admin.email
                           ],
                           (error4, adminId, fields4) => {
                                if(error4){
                                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid2");
                                }

                                return callBack(null, adminId[0].id);
                           }
                       );
                    }
                );
            }
        );
    },


    verifyAdminOp: (verifyCode, callBack) =>{
        pool.query(
            "SELECT id FROM person WHERE verify_code=?",
            [
                verifyCode
            ],
            (error, result, fields) =>{
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                }
                // eslint-disable-next-line no-else-return
                else if(result.length === 0){
                    return callBack("Incorrect code");
                }

                const adminId = result[0].id;
                pool.query(
                    "UPDATE person "
                    +"SET verify_code = 0, verified = 1, is_admin = 1 "
                    +"WHERE id=?",
                    [
                        adminId
                    ],
                    (error2, results2, fields2) =>{
                        if(error2){
                            return callBack("Error in mysql settings or the request on your query is time out or query is invalid");
                        }

                        return callBack(null, adminId.toString());
                    }
                );
            }
        );
    },

    completeVerifyAdminOp : (adminId, refreshToken, callback) => {
        pool.query(
            "UPDATE person SET refresh_token=? WHERE id=?",
            [
                refreshToken, 
                adminId
            ],
            (error, result, fields) => {
                if(error){
                    return callback("Error in mysql settings or the request on your query is time out or query is invalid")
                }
                
                return callback(null);
        });
    },



    uploadProfileImageOp : (adminId, fileName, callback) => {
        pool.query(
            "INSERT INTO photo(image_path, person_id, request_id, cartificate_type, identity_type, personal_type, banner)VALUES(?,?,?,?,?,?,?) ",
            [
                fileName, 
                adminId,
                0,
                0,
                0,
                1,
                0
            ],
            (error, result, fields) => {
                if(error){
                    return callback("Error in mysql settings or the request on your query is time out or query is invalid")
                }
                
                return callback(null);
        });
    },

    uploadPersonalIdentityImageOp : (adminId, fileName, callback) => {
        pool.query(
            "INSERT INTO photo(image_path, person_id, request_id, cartificate_type, identity_type, personal_type, banner)VALUES(?,?,?,?,?,?,?) ",
            [
                fileName, 
                adminId,
                0,
                0,
                1,
                0,
                0
            ],
            (error, result, fields) => {
                if(error){
                    return callback("Error in mysql settings or the request on your query is time out or query is invalid")
                }
                
                return callback(null);
        });
    },



    signInAdminOp: (admin, callBack) =>{
        pool.query(
            "SELECT id, password FROM person WHERE email=?",
            [
                admin.email,
            ],
            (error, result, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out");
                }
                
                if(result.length === 0){
                    return callBack("your email or password isn't correct")
                }
                
                if (!hashVerify(admin.password, result[0].password)) {
                    return callBack("your email or password isn't correct")
                }
                
                return callBack(null, result[0].id.toString());
            }
        );
    },

    directSignInWithFacebookIdOp: (facebookId, callBack) =>{
        pool.query(
            "SELECT id FROM person WHERE facebook_id=?",
            [
                facebookId
            ],
            (error, result, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out");
                }
                // eslint-disable-next-line no-else-return
                else if(result.length === 0){
                    return callBack("Facebook id isn't correct")
                }

                const adminId = result[0].id;
                
                return callBack(null, adminId);
            }
        );
    },

    directSignInWithMicrosoftIdOp: (microsoftId, callBack) =>{
        pool.query(
            "SELECT id FROM person WHERE microsoft_id=?",
            [
                microsoftId
            ],
            (error, result, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out");
                }
                // eslint-disable-next-line no-else-return
                else if(result.length === 0){
                    return callBack("Facebook id isn't correct")
                }

                const adminId = result[0].id;
                
                return callBack(null, adminId);
            }
        );
    },
    
    checkIdentityOp: (cerdiential, callBack) => {
        pool.query(
            "SELECT id FROM person WHERE email = ?",
            [
                cerdiential
            ],
            (error, result, field) =>{
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out");
                }

                if (result.length === 1) {
                    return callBack(null, result[0].id);
                }

                pool.query(
                    "SELECT id FROM person WHERE phone_num = ?",
                    [
                        cerdiential
                    ],
                    (error2, result2, fields2) => {
                        if(error2){
                            return callBack("Error in mysql settings or the request on your query is time out");
                        }

                        if (result2.length === 1) {
                            return callBack(null, result2[0].id);
                        }

                        return callBack("Your Email or phone number isn't correct")
                    }
                );
            }
        );
    },

    completeCheckIdentityOp: (adminId, verifyCode, callBack) => {
        pool.query(
            "UPDATE person "
            +"SET verify_code = ? "
            +"WHERE id = ?",
            [
                verifyCode,
                adminId
            ],
            (error, result, fields) => {
                if(error){
                    return callBack("Error in mysql settings or the request on your query is time out");
                }

                pool.query(
                    "SELECT email FROM person WHERE id = ?",
                    [
                        adminId
                    ],
                    (error2, result2, fields2) => {
                        if(error2){
                            return callBack("Error in mysql settings or the request on your query is time out");
                        }

                        return callBack(null, result2[0].email);
                    }
                );
            }
        );
    },

    verificationIdentityOp: (code, callBack) => {
        pool.query(
            "SELECT id FROM person WHERE verify_code = ?",
            [
                code
            ],
            (error, result, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out");
                }

                if (result.length === 1) {

                    let adminId = result[0].id;

                    pool.query(
                        "UPDATE person "
                        +"SET verify_code = ? "
                        +"WHERE id = ? ",
                        [
                            0,
                            adminId
                        ],
                        (error2, result2, fields2) =>{
                            if (error2) {
                                return callBack("Error in mysql settings or the request on your query is time out");
                            }

                            return callBack(null, adminId.toString());
                        }
                    );
                }
                else{
                    return callBack("Incorrect code")
                }

            }
        )
    },

    resetPasswordOp: (adminId, newPassword, callBack) => {
        pool.query(
            "UPDATE person "
            +"SET password = ? "
            +"WHERE id = ?",
            [
                newPassword,
                adminId
            ],
            (error, result, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out");
                }

                return callBack(null);
            }
        )
    },
}