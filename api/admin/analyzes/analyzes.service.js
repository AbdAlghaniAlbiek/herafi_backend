const pool = require('../../../config/database');


module.exports = {

    //For Profits Rad
    getProfitsYearsOp : (callBack) => {
        pool.query(
            "SELECT DISTINCT YEAR(end_date) AS year "
            +"FROM request "
            +"WHERE end_date <> 0 "
            +"ORDER BY year DESC ",
            [],
            (error, years, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, years);
            }
        );
    },

    getProfitsMonthsOp : (year, callBack) => {
        pool.query(
            "SELECT DISTINCT MONTH(end_date) AS month "
            +"FROM request "
            +"WHERE YEAR(end_date) = ? AND end_date <> 0 "
            +"ORDER BY month DESC ",
            [
                year
            ],
            (error, months, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, months);
            }
        );
    },

    getProfitsYearsDetailsOp : (callBack) => {
        pool.query(
            "SELECT YEAR(end_date) AS year, SUM(total_cost) AS paids "
            +"FROM request "
            +"WHERE end_date <> 0 "
            +"GROUP BY year ",
            [],
            (error, profitsYears, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, profitsYears);
            }
        );
    },

    getProfitsMonthsDetailsOp : (year, callBack) => {
        pool.query(
            "SELECT MONTH(end_date) AS month, SUM(total_cost) AS paids "
            +"FROM request "
            +"WHERE end_date <> 0 AND  YEAR(end_date) = ? "
            +"GROUP BY month ",
            [
                year
            ],
            (error, profitsMonths, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, profitsMonths);
            }
        );
    },

    getProfitsDaysDetailsOp : (year, month, callBack) => {
        pool.query(
            "SELECT YEAR(end_date) AS year, MONTH(end_date) AS month, DAY(end_date) AS day, SUM(total_cost) AS paids "
            +"FROM request "
            +"WHERE YEAR(end_date) = ? AND MONTH(end_date) = ? AND end_date <> 0 "
            +"GROUP BY year, month, day ",
            [
                year, 
                month
            ],
            (error, profitsDays, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, profitsDays);
            }
        );
    },



    //For Craftmen Rad
    getCraftmenYearsOp : (callBack) => {
        pool.query(
            "SELECT DISTINCT YEAR(date_join) AS year "
            +"FROM person "
            +"WHERE date_join <> 0 AND lowest_cost <> 0 AND highest_cost <> 0 AND verified = 1 "
            +"ORDER BY year DESC ",
            [],
            (error, years, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, years);
            }
        );
    },

    getCraftmenMonthsOp : (year, callBack) => {
        pool.query(
            "SELECT DISTINCT MONTH(date_join) AS month "
            +"FROM person "
            +"WHERE YEAR(date_join) = ? AND lowest_cost <> 0 AND highest_cost <> 0 AND verified = 1 "
            +"ORDER BY month DESC ",
            [
                year
            ],
            (error, months, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, months);
            }
        );
    },

    getCraftmenYearsDetailsOp : (callBack) => {
        pool.query(
            "SELECT YEAR(date_join) AS year, COUNT(id) AS craftmen_number "
            +"FROM person "
            +"WHERE YEAR(date_join) <> 0 AND lowest_cost <> 0 AND highest_cost <> 0 AND verified = 1 "
            +"GROUP BY year ",
            [],
            (error, craftmenYears, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, craftmenYears);
            }
        );
    },

    getCraftmenMonthsDetailsOp : (year, callBack) => {
        pool.query(
            "SELECT MONTH(date_join) AS month, COUNT(id) AS craftmen_number "
            +"FROM person "
            +"WHERE MONTH(date_join) <> 0 AND  YEAR(date_join) = ? AND lowest_cost <> 0 AND highest_cost <> 0 AND verified = 1 "
            +"GROUP BY month ",
            [
                year
            ],
            (error, craftmenMonths, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, craftmenMonths);
            }
        );
    },

    getCraftmenDaysDetailsOp : (year, month, callBack) => {
        pool.query(
            "SELECT YEAR(date_join) AS year, MONTH(date_join) AS month, DAY(date_join) AS day, COUNT(id) AS craftmen_number "
            +"FROM person "
            +"WHERE YEAR(date_join) = ? AND MONTH(date_join) = ? AND lowest_cost <> 0 AND highest_cost <> 0 AND verified = 1 "
            +"GROUP BY year, month, day ",
            [
                year, 
                month
            ],
            (error, craftmenDays, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, craftmenDays);
            }
        );
    },



    //For Users Rad
    getUsersYearsOp : (callBack) => {
        pool.query(
            "SELECT DISTINCT YEAR(date_join) AS year "
            +"FROM person "
            +"WHERE date_join <> 0 AND lowest_cost = 0 AND highest_cost = 0 AND verified = 1 AND is_admin = 0 "
            +"ORDER BY year DESC ",
            [],
            (error, years, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, years);
            }
        );
    },

    getUsersMonthsOp : (year, callBack) => {
        pool.query(
            "SELECT DISTINCT MONTH(date_join) AS month "
            +"FROM person "
            +"WHERE YEAR(date_join) = ? AND lowest_cost = 0 AND highest_cost = 0 AND verified = 1 AND is_admin = 0 "
            +"ORDER BY month DESC ",
            [
                year
            ],
            (error, months, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, months);
            }
        );
    },

    getUsersYearsDetailsOp : (callBack) => {
        pool.query(
            "SELECT YEAR(date_join) AS year, COUNT(id) AS users_number "
            +"FROM person "
            +"WHERE YEAR(date_join) <> 0 AND lowest_cost = 0 AND highest_cost = 0 AND verified = 1 AND is_admin = 0 "
            +"GROUP BY year ",
            [],
            (error, usersYears, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, usersYears);
            }
        );
    },

    getUsersMonthsDetailsOp : (year, callBack) => {
        pool.query(
            "SELECT MONTH(date_join) AS month, COUNT(id) AS users_number "
            +"FROM person "
            +"WHERE MONTH(date_join) <> 0 AND  YEAR(date_join) = ? AND lowest_cost = 0 AND highest_cost = 0 AND verified = 1 AND is_admin = 0 "
            +"GROUP BY month ",
            [
                year
            ],
            (error, usersMonths, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, usersMonths);
            }
        );
    },

    getUsersDaysDetailsOp : (year, month, callBack) => {
        pool.query(
            "SELECT YEAR(date_join) AS year, MONTH(date_join) AS month, DAY(date_join) AS day, COUNT(id) AS users_number "
            +"FROM person "
            +"WHERE YEAR(date_join) = ? AND MONTH(date_join) = ? AND lowest_cost = 0 AND highest_cost = 0 AND verified = 1 AND is_admin = 0 "
            +"GROUP BY year, month, day ",
            [
                year, 
                month
            ],
            (error, usersDays, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, usersDays);
            }
        );
    },



    //For Requests Rad
    getRequestsYearsOp : (callBack) => {
        pool.query(
            "SELECT DISTINCT YEAR(start_date) AS year "
            +"FROM request "
            +"WHERE start_date <> 0 "
            +"ORDER BY year DESC ",
            [],
            (error, years, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, years);
            }
        );
    },

    getRequestsMonthsOp : (year, callBack) => {
        pool.query(
            "SELECT DISTINCT MONTH(start_date) AS month "
            +"FROM request "
            +"WHERE YEAR(start_date) = ? AND start_date <> 0 "
            +"ORDER BY month DESC ",
            [
                year
            ],
            (error, months, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, months);
            }
        );
    },

    getRequestsYearsDetailsOp : (callBack) => {
        pool.query(
            "SELECT YEAR(start_date) AS year, COUNT(id) AS requests_number "
            +"FROM request "
            +"WHERE start_date <> 0 "
            +"GROUP BY year ",
            [],
            (error, reqYears, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, reqYears);
            }
        );
    },

    getRequestsMonthsDetailsOp : (year, callBack) => {
        pool.query(
            "SELECT MONTH(start_date) AS month, COUNT(id) AS requests_number "
            +"FROM request "
            +"WHERE start_date <> 0 AND  YEAR(start_date) = ?"
            +"GROUP BY month ",
            [
                year
            ],
            (error, reqMonths, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, reqMonths);
            }
        );
    },

    getRequestsDaysDetailsOp : (year, month, callBack) => {
        pool.query(
            "SELECT YEAR(start_date) AS year, MONTH(start_date) AS month, DAY(start_date) AS day, COUNT(id) AS requests_number "
            +"FROM request "
            +"WHERE YEAR(start_date) = ? AND MONTH(start_date) = ? AND start_date <> 0 "
            +"GROUP BY year, month, day ",
            [
                year, 
                month
            ],
            (error, reqDays, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, reqDays);
            }
        );
    },


    //For Reports Rad
    getReportsYearsOp : (callBack) => {
        pool.query(
            "SELECT DISTINCT YEAR(date) AS year "
            +"FROM report "
            +"WHERE date <> 0 "
            +"ORDER BY year DESC ",
            [],
            (error, years, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, years);
            }
        );
    },

    getReportsMonthsOp : (year, callBack) => {
        pool.query(
            "SELECT DISTINCT MONTH(date) AS month "
            +"FROM report "
            +"WHERE YEAR(date) = ? AND date <> 0 "
            +"ORDER BY month DESC ",
            [
                year
            ],
            (error, months, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, months);
            }
        );
    },

    getReportsYearsDetailsOp : (callBack) => {
        pool.query(
            "SELECT YEAR(date) AS year, COUNT(id) AS reports_number "
            +"FROM report "
            +"WHERE date <> 0 "
            +"GROUP BY year ",
            [],
            (error, reqYears, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, reqYears);
            }
        );
    },

    getReportsMonthsDetailsOp : (year, callBack) => {
        pool.query(
            "SELECT MONTH(date) AS month, COUNT(id) AS reports_number "
            +"FROM report "
            +"WHERE date <> 0 AND  YEAR(date) = ?"
            +"GROUP BY month ",
            [
                year
            ],
            (error, reqMonths, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, reqMonths);
            }
        );
    },

    getReportsDaysDetailsOp : (year, month, callBack) => {
        pool.query(
            "SELECT YEAR(date) AS year, MONTH(date) AS month, DAY(date) AS day, COUNT(id) AS reports_number "
            +"FROM report "
            +"WHERE YEAR(date) = ? AND MONTH(date) = ? AND date <> 0 "
            +"GROUP BY year, month, day ",
            [
                year, 
                month
            ],
            (error, reqDays, fields) => {
                if (error) {
                    return callBack("Error in mysql settings or the request on your query is time out or invalid query");
                }

                return callBack(null, reqDays);
            }
        );
    },
}