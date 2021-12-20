const pool = require('../../../config/database');

module.exports = {

    getProfitsPerDaysOp : (callBack) => {
        pool.query(
            "SELECT temp_year.last_year, temp_month.last_month,  DAY(r.end_date) AS day, SUM(r.total_cost) AS paids "
            +"FROM request r "
            +"JOIN "
                +"( "
                     +"SELECT MAX(YEAR(end_date)) AS last_year "
                     +"FROM request "
               +" ) AS temp_year "
           + "ON YEAR(r.end_date) = temp_year.last_year "
            
            +"JOIN "
                +"( "
                   +" SELECT MAX(MONTH(r.end_date)) AS last_month "
                    +"FROM request r "
                    +"JOIN "
                        +"( "
                            +"SELECT MAX(YEAR(end_date)) AS last_year "
                            +"FROM request "
                       +" ) AS temp "
                    +"ON YEAR(r.end_date) = temp.last_year "
                +") AS temp_month "
            +"ON MONTH(r.end_date) = temp_month.last_month "
            
            +"GROUP BY temp_year.last_year, temp_month.last_month, DAY(r.end_date) ",
            [],
            (error, profits, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, profits);
            }
        )
    },


    getNewMembersOp : (callBack) => {
        pool.query(
            "SELECT cr.new_members_craftmen_num, us.new_members_users_num "
            +"FROM "
            +"( "
                +"SELECT COUNT(id) AS new_members_craftmen_num "
                +"FROM person "
                +"WHERE lowest_cost <> 0 AND highest_cost <> 0 AND verified = 0 "
            +") AS cr, "
            +"("
                +"SELECT COUNT(id) AS new_members_users_num "
                +"FROM person "
                +"WHERE lowest_cost = 0 AND highest_cost = 0 AND verified = 0 AND is_admin = 0 "
            +") AS us ",
            [],
            (error, newMembers, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, newMembers[0]);
            }
        )
    },
};