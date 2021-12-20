const pool = require('../../../config/database');


module.exports = {

    getAdminProfileOp: (adminId, callBack) =>{
        pool.query(
           "SELECT p.id, p.name, p.email,  p.phone_num AS phone_number, p.identity_num AS national_number, c.name AS city, p.date_join, per_img.profile_image, ident_img.personal_identity_image " 
           +"FROM person p "
           +" JOIN "
                +"( "
                   +"SELECT person_id, image_path AS personal_identity_image"
                   +" FROM photo "
                   +" WHERE identity_type = 1 "
                +") AS ident_img "
           +" ON p.id = ident_img.person_id "

            +"JOIN "
                +"( "
                    +"SELECT person_id, image_path AS profile_image "
                    +"FROM photo "
                    +"WHERE personal_type = 1 "
                +") AS per_img "
           +" ON  per_img.person_id = p.id "

            +"JOIN "
               +"( "
                    +"SELECT id, name "
                    +"FROM city "
                +") AS c "
           +" ON p.city_id = c.id "

            +"WHERE p.id = ? ",
            [
                adminId
            ],
            (error, admin, fields) => {
                if(error){
                    console.log(error)
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }
                
                return callBack(null, admin[0]);
            }
        );
    },

    updateAdminProfileOp: (admin, callBack) =>{
    },


    requestFacebookIdOp: (callBack) =>{
    },

    addFacebookAccountOp: (facebookId, res) =>{
    },


    requestMicrosoftIdOp: (callBack) =>{
    },

    addMicrosoftAccountOp: (facebookId, res) =>{
    },
}
