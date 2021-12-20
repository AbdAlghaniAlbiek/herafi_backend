const {
    LoggerService,
    appType
} = require('../../../services/logging');
const {
    getProfitsYearsOp,
    getProfitsMonthsOp,
    getProfitsYearsDetailsOp,
    getProfitsMonthsDetailsOp,
    getProfitsDaysDetailsOp,

    getCraftmenDaysDetailsOp,
    getCraftmenMonthsDetailsOp,
    getCraftmenMonthsOp,
    getCraftmenYearsDetailsOp,
    getCraftmenYearsOp,

    getReportsDaysDetailsOp,
    getReportsMonthsDetailsOp,
    getReportsMonthsOp,
    getReportsYearsDetailsOp,
    getReportsYearsOp,

    getRequestsDaysDetailsOp,
    getRequestsMonthsDetailsOp,
    getRequestsMonthsOp,
    getRequestsYearsDetailsOp,
    getRequestsYearsOp,

    getUsersDaysDetailsOp,
    getUsersMonthsDetailsOp,
    getUsersMonthsOp,
    getUsersYearsDetailsOp,
    getUsersYearsOp,
    
} = require('./analyzes.service');
const {
    aesEncryption, aesDecryption
} = require('../../../security/aes_algorithm');


const log = new LoggerService("analyzes", appType.admin, false);


module.exports = {

    //Profits controllers
    getProfitsYears : (req, res) => {
        getProfitsYearsOp((error, profitsYears) => {
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

            let years = new Array();
            for (let i = 0; i < profitsYears.length; i++) {
                years.push(aesEncryption(profitsYears[i].year.toString()));
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: years,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getProfitsMonths : (req, res) => {
        if (!req.query.year) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const decYear = aesDecryption(req.query.year);

        getProfitsMonthsOp(decYear, (error, profitsMonths) => {
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

            let months = new Array();
            for (let i = 0; i < profitsMonths.length; i++) {
                months.push(aesEncryption(profitsMonths[i].month.toString()));
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: months,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getProfitsDetails : (req, res) => {
        if (!req.query.year || !req.query.month) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        let decYear = aesDecryption(req.query.year);
        let decMonth = aesDecryption(req.query.month);


        switch (decMonth)
                {
                    case "January":
                        {
                            decMonth = "1";
                            break;
                        }
                    case "February":
                        {
                            decMonth = "2";
                            break;
                        }
                    case "March":
                        {
                            decMonth = "3";
                            break;
                        }
                    case "April":
                        {
                            decMonth = "4";
                            break;
                        }
                    case "May":
                        {
                            decMonth = "5";
                            break;
                        }
                    case "June":
                        {
                            decMonth = "6";
                            break;
                        }
                    case "July":
                        {
                            decMonth = "7";
                            break;
                        }
                    case "August":
                        {
                            decMonth = "8";
                            break;
                        }
                    case "September":
                        {
                            decMonth = "9";
                            break;
                        }
                    case "October":
                        {
                            decMonth = "10";
                            break;
                        }
                    case "November":
                        {
                            decMonth = "11";
                            break;
                        }
                    case "December":
                        {
                            decMonth = "12";
                            break;
                        }
                    default:
                        break;
                }


        let newProfitsYears = 0;
        let newProfitsMonths = 0;
        let newProfitsDays = 0;
        let total = 0;

        getProfitsYearsDetailsOp((error, profitsYears) => {
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

            if (profitsYears.length === 1) {
                newProfitsYears =  0;
            }
            else{
                for (let i = 0; i < profitsYears.length; i++) {
                    total += profitsYears[i].paids;
                }

                newProfitsYears = total / profitsYears.length;
            }

            getProfitsMonthsDetailsOp(decYear, (error2, profitsMonths) => {
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

                if (profitsMonths.length === 1) {
                    newProfitsMonths = 0;
                }
                else{
                    for (let i = 0; i < profitsMonths.length; i++) {
                        newProfitsMonths += profitsMonths[i].paids;
                    }

                    newProfitsMonths /= profitsMonths.length;
                }


                getProfitsDaysDetailsOp(decYear, decMonth, (error3, profitsDays) => {
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

                    let newProfitsHours

                    if (profitsDays.length === 1) {
                        newProfitsDays = 0;
                        newProfitsHours = 0;
                    }
                    else{
                        for (let i = 0; i < profitsDays.length; i++) {
                            newProfitsDays += profitsDays[i].paids;
                        }

                        newProfitsHours = newProfitsDays / profitsDays.length * 24;
                        newProfitsDays /= profitsDays.length;
                    }

                     //The incrementing +1 very important for making charts
                    let newProfits = new Array();
                    let isFound = false;
                    if (profitsDays[0].month === 2) {

                        if (profitsDays[0].year % 4 === 0) {
                            for (let i = 0; i < 29 + 1; i++) {
                                if (i === 0) {
                                    newProfits.push({
                                        day: aesEncryption(i.toString()),
                                        paids: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < profitsDays.length; j++) {
                                        if (profitsDays[j].day === i) {
                                            newProfits.push({
                                                day: aesEncryption(profitsDays[j].day.toString()),
                                                paids: aesEncryption(profitsDays[j].paids.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newProfits.push({
                                            day: aesEncryption(i.toString()),
                                            paids: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                        else{
                            for (let i = 0; i < 28 + 1; i++) {
                                if (i === 0) {
                                    newProfits.push({
                                        day: aesEncryption(i.toString()),
                                        paids: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < profitsDays.length; j++) {
                                        if (profitsDays[j].day === i) {
                                            newProfits.push({
                                                day: aesEncryption(profitsDays[j].day.toString()),
                                                paids: aesEncryption(profitsDays[j].paids.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newProfits.push({
                                            day: aesEncryption(i.toString()),
                                            paids: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else{

                        //Month 4, 6, 8, 10, 12
                        if (profitsDays[0].month % 2 === 0) {
                            for (let i = 0; i < 30 + 1; i++) {
                                if (i === 0) {
                                    newProfits.push({
                                        day: aesEncryption(i.toString()),
                                        paids: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < profitsDays.length; j++) {
                                        if (profitsDays[j].day === i) {
                                            newProfits.push({
                                                day: aesEncryption(profitsDays[j].day.toString()),
                                                paids: aesEncryption(profitsDays[j].paids.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newProfits.push({
                                            day: aesEncryption(i.toString()),
                                            paids: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }

                        //Month 1, 3, 5, 7, 9, 11
                        else{
                            for (let i = 0; i < 31 + 1; i++) {
                                if (i === 0) {
                                    newProfits.push({
                                        day: aesEncryption(i.toString()),
                                        paids: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < profitsDays.length; j++) {
                                        if (profitsDays[j].day === i) {
                                            newProfits.push({
                                                day: aesEncryption(profitsDays[j].day.toString()),
                                                paids: aesEncryption(profitsDays[j].paids.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newProfits.push({
                                            day: aesEncryption(i.toString()),
                                            paids: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                    }

                    log.debug("Success operation");
                    return res.status(200).json({
                        response:{
                            result:{
                                profits_rad: newProfits,
                                per_year: aesEncryption(newProfitsYears.toFixed(3)),
                                per_month: aesEncryption(newProfitsMonths.toFixed(3)),
                                per_day: aesEncryption(newProfitsDays.toFixed(3)),
                                per_hour: aesEncryption(newProfitsHours.toFixed(3)),
                                total: aesEncryption(total.toString()) 
                            }, 
                            token : req.accessToken ? req.accessToken : ""
                        },
                        errorMessage : ""
                    })
                });
            });
        });
    },


    //Craftmen controllers
    getCraftmenYears : (req, res) => {
        getCraftmenYearsOp((error, craftmenYears) => {
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

            let years = new Array();
            for (let i = 0; i < craftmenYears.length; i++) {
                years.push(aesEncryption(craftmenYears[i].year.toString()));
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: years,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getCraftmenMonths : (req, res) => {
        if (!req.query.year) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const decYear = aesDecryption(req.query.year);

        getCraftmenMonthsOp(decYear, (error, craftmenMonths) => {
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

            let months = new Array();
            for (let i = 0; i < craftmenMonths.length; i++) {
                months.push(aesEncryption(craftmenMonths[i].month.toString()));
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: months,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getCraftmenDetails : (req, res) => {
        if (!req.query.year || !req.query.month) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const decYear = aesDecryption(req.query.year);
        let decMonth = aesDecryption(req.query.month);


        switch (decMonth)
        {
            case "January":
                {
                    decMonth = "1";
                    break;
                }
            case "February":
                {
                    decMonth = "2";
                    break;
                }
            case "March":
                {
                    decMonth = "3";
                    break;
                }
            case "April":
                {
                    decMonth = "4";
                    break;
                }
            case "May":
                {
                    decMonth = "5";
                    break;
                }
            case "June":
                {
                    decMonth = "6";
                    break;
                }
            case "July":
                {
                    decMonth = "7";
                    break;
                }
            case "August":
                {
                    decMonth = "8";
                    break;
                }
            case "September":
                {
                    decMonth = "9";
                    break;
                }
            case "October":
                {
                    decMonth = "10";
                    break;
                }
            case "November":
                {
                    decMonth = "11";
                    break;
                }
            case "December":
                {
                    decMonth = "12";
                    break;
                }
            default:
                break;
        }



        let newCraftmenYears = 0;
        let newCraftmenMonths = 0;
        let newCraftmenDays = 0;
        let total = 0;

        getCraftmenYearsDetailsOp((error, craftmenYears) => {
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

            if (craftmenYears.length === 1) {
                newCraftmenYears =  0;
            }
            else{
                for (let i = 0; i < craftmenYears.length; i++) {
                    total += craftmenYears[i].craftmen_number;
                }

                newCraftmenYears = total / craftmenYears.length;
            }

            getCraftmenMonthsDetailsOp(decYear, (error2, craftmenMonths) => {
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

                if (craftmenMonths.length === 1) {
                    newCraftmenMonths = 0;
                }
                else{
                    for (let i = 0; i < craftmenMonths.length; i++) {
                        newCraftmenMonths += craftmenMonths[i].craftmen_number;
                    }

                    newCraftmenMonths /= craftmenMonths.length;
                }


                getCraftmenDaysDetailsOp(decYear, decMonth, (error3, craftmenDays) => {
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

                    let newCraftmenHours

                    if (craftmenDays.length === 1) {
                        newCraftmenDays = 0;
                        newCraftmenHours = 0;
                    }
                    else{
                        for (let i = 0; i < craftmenDays.length; i++) {
                            newCraftmenDays += craftmenDays[i].craftmen_number;
                        }

                        newCraftmenHours = newCraftmenDays / craftmenDays.length * 24;
                        newCraftmenDays /= craftmenDays.length;
                    }

                     //The incrementing +1 very important for making charts
                    let newCraftmen = new Array();
                    let isFound = false;
                    if (craftmenDays[0].month === 2) {

                        if (craftmenDays[0].year % 4 === 0) {
                            for (let i = 0; i < 29 + 1; i++) {
                                if (i === 0) {
                                    newCraftmen.push({
                                        day: aesEncryption(i.toString()),
                                        craftmen_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < craftmenDays.length; j++) {
                                        if (craftmenDays[j].day === i) {
                                            newCraftmen.push({
                                                day: aesEncryption(craftmenDays[j].day.toString()),
                                                craftmen_number: aesEncryption(craftmenDays[j].craftmen_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newCraftmen.push({
                                            day: aesEncryption(i.toString()),
                                            craftmen_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                        else{
                            for (let i = 0; i < 28 + 1; i++) {
                                if (i === 0) {
                                    newCraftmen.push({
                                        day: aesEncryption(i.toString()),
                                        craftmen_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < craftmenDays.length; j++) {
                                        if (craftmenDays[j].day === i) {
                                            newCraftmen.push({
                                                day: aesEncryption(craftmenDays[j].day.toString()),
                                                craftmen_number: aesEncryption(craftmenDays[j].craftmen_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newCraftmen.push({
                                            day: aesEncryption(i.toString()),
                                            craftmen_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else{

                        //Month 4, 6, 8, 10, 12
                        if (craftmenDays[0].month % 2 === 0) {
                            for (let i = 0; i < 30 + 1; i++) {
                                if (i === 0) {
                                    newCraftmen.push({
                                        day: aesEncryption(i.toString()),
                                        craftmen_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < craftmenDays.length; j++) {
                                        if (craftmenDays[j].day === i) {
                                            newCraftmen.push({
                                                day: aesEncryption(craftmenDays[j].day.toString()),
                                                craftmen_number: aesEncryption(craftmenDays[j].craftmen_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newCraftmen.push({
                                            day: aesEncryption(i.toString()),
                                            craftmen_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }

                        //Month 1, 3, 5, 7, 9, 11
                        else{
                            for (let i = 0; i < 31 + 1; i++) {
                                if (i === 0) {
                                    newCraftmen.push({
                                        day: aesEncryption(i.toString()),
                                        craftmen_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < craftmenDays.length; j++) {
                                        if (craftmenDays[j].day === i) {
                                            newCraftmen.push({
                                                day: aesEncryption(craftmenDays[j].day.toString()),
                                                craftmen_number: aesEncryption(craftmenDays[j].craftmen_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newCraftmen.push({
                                            day: aesEncryption(i.toString()),
                                            craftmen_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                    }


                    log.debug("Success operation");
                    return res.status(200).json({
                        response:{
                            result:{
                                craftmen_rad: newCraftmen,
                                per_year: aesEncryption(newCraftmenYears.toFixed(3)),
                                per_month: aesEncryption(newCraftmenMonths.toFixed(3)),
                                per_day: aesEncryption(newCraftmenDays.toFixed(3)),
                                per_hour: aesEncryption(newCraftmenHours.toFixed(3)),
                                total: aesEncryption(total.toString()) 
                            }, 
                            token : req.accessToken ? req.accessToken : ""
                        },
                        errorMessage : ""
                    })
                });
            });
        });
    },


    //Users controllers
    getUsersYears : (req, res) => {
        getUsersYearsOp((error, usersYears) => {
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

            let years = new Array();
            for (let i = 0; i < usersYears.length; i++) {
                years.push(aesEncryption(usersYears[i].year.toString()));
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: years,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getUsersMonths : (req, res) => {
        if (!req.query.year) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const decYear = aesDecryption(req.query.year);

        getUsersMonthsOp(decYear, (error, usersMonths) => {
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

            let months = new Array();
            for (let i = 0; i < usersMonths.length; i++) {
                months.push(aesEncryption(usersMonths[i].month.toString()));
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: months,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getUsersDetails : (req, res) => {
        if (!req.query.year || !req.query.month) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const decYear = aesDecryption(req.query.year);
        let decMonth = aesDecryption(req.query.month);

        switch (decMonth)
        {
            case "January":
                {
                    decMonth = "1";
                    break;
                }
            case "February":
                {
                    decMonth = "2";
                    break;
                }
            case "March":
                {
                    decMonth = "3";
                    break;
                }
            case "April":
                {
                    decMonth = "4";
                    break;
                }
            case "May":
                {
                    decMonth = "5";
                    break;
                }
            case "June":
                {
                    decMonth = "6";
                    break;
                }
            case "July":
                {
                    decMonth = "7";
                    break;
                }
            case "August":
                {
                    decMonth = "8";
                    break;
                }
            case "September":
                {
                    decMonth = "9";
                    break;
                }
            case "October":
                {
                    decMonth = "10";
                    break;
                }
            case "November":
                {
                    decMonth = "11";
                    break;
                }
            case "December":
                {
                    decMonth = "12";
                    break;
                }
            default:
                break;
        }



        let newUsersYears = 0;
        let newUsersMonths = 0;
        let newUsersDays = 0;
        let total = 0;

        getUsersYearsDetailsOp((error, usersYears) => {
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

            if (usersYears.length === 1) {
                newUsersYears =  0;
            }
            else{
                for (let i = 0; i < usersYears.length; i++) {
                    total += usersYears[i].users_number;
                }

                newUsersYears = total / usersYears.length;
            }

            getUsersMonthsDetailsOp(decYear, (error2, usersMonths) => {
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

                if (usersMonths.length === 1) {
                    newUsersMonths = 0;
                }
                else{
                    for (let i = 0; i < usersMonths.length; i++) {
                        newUsersMonths += usersMonths[i].users_number;
                    }

                    newUsersMonths /= usersMonths.length;
                }


                getUsersDaysDetailsOp(decYear, decMonth, (error3, usersDays) => {
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

                    let newUsersHours

                    if (usersDays.length === 1) {
                        newUsersDays = 0;
                        newUsersHours = 0;
                    }
                    else{
                        for (let i = 0; i < usersDays.length; i++) {
                            newUsersDays += usersDays[i].users_number;
                        }

                        newUsersHours = newUsersDays / usersDays.length * 24;
                        newUsersDays /= usersDays.length;
                    }

                     //The incrementing +1 very important for making charts
                    let newUsers = new Array();
                    let isFound = false;
                    if (usersDays[0].month === 2) {

                        if (usersDays[0].year % 4 === 0) {
                            for (let i = 0; i < 29 + 1; i++) {
                                if (i === 0) {
                                    newUsers.push({
                                        day: aesEncryption(i.toString()),
                                        users_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < usersDays.length; j++) {
                                        if (usersDays[j].day === i) {
                                            newUsers.push({
                                                day: aesEncryption(usersDays[j].day.toString()),
                                                users_number: aesEncryption(usersDays[j].users_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newUsers.push({
                                            day: aesEncryption(i.toString()),
                                            users_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                        else{
                            for (let i = 0; i < 28 + 1; i++) {
                                if (i === 0) {
                                    newUsers.push({
                                        day: aesEncryption(i.toString()),
                                        users_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < usersDays.length; j++) {
                                        if (usersDays[j].day === i) {
                                            newUsers.push({
                                                day: aesEncryption(usersDays[j].day.toString()),
                                                users_number: aesEncryption(usersDays[j].users_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newUsers.push({
                                            day: aesEncryption(i.toString()),
                                            users_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else{

                        //Month 4, 6, 8, 10, 12
                        if (usersDays[0].month % 2 === 0) {
                            for (let i = 0; i < 30 + 1; i++) {
                                if (i === 0) {
                                    newUsers.push({
                                        day: aesEncryption(i.toString()),
                                        users_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < usersDays.length; j++) {
                                        if (usersDays[j].day === i) {
                                            newUsers.push({
                                                day: aesEncryption(usersDays[j].day.toString()),
                                                users_number: aesEncryption(usersDays[j].users_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newUsers.push({
                                            day: aesEncryption(i.toString()),
                                            users_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }

                        //Month 1, 3, 5, 7, 9, 11
                        else{
                            for (let i = 0; i < 31 + 1; i++) {
                                if (i === 0) {
                                    newUsers.push({
                                        day: aesEncryption(i.toString()),
                                        users_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < usersDays.length; j++) {
                                        if (usersDays[j].day === i) {
                                            newUsers.push({
                                                day: aesEncryption(usersDays[j].day.toString()),
                                                users_number: aesEncryption(usersDays[j].users_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newUsers.push({
                                            day: aesEncryption(i.toString()),
                                            users_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                    }


                    log.debug("Success operation");
                    return res.status(200).json({
                        response:{
                            result:{
                                users_rad: newUsers,
                                per_year: aesEncryption(newUsersYears.toFixed(3)),
                                per_month: aesEncryption(newUsersMonths.toFixed(3)),
                                per_day: aesEncryption(newUsersDays.toFixed(3)),
                                per_hour: aesEncryption(newUsersHours.toFixed(3)),
                                total: aesEncryption(total.toString()) 
                            }, 
                            token : req.accessToken ? req.accessToken : ""
                        },
                        errorMessage : ""
                    })
                });
            });
        });
    },


    //Requests controllers
    getRequestsYears : (req, res) => {
        getRequestsYearsOp((error, requestsYears) => {
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

            let years = new Array();
            for (let i = 0; i < requestsYears.length; i++) {
                years.push(aesEncryption(requestsYears[i].year.toString()));
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result:years,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getRequestsMonths : (req, res) => {
        if (!req.query.year) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const decYear = aesDecryption(req.query.year);

        getRequestsMonthsOp(decYear, (error, requestsMonths) => {
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

            let months = new Array();
            for (let i = 0; i < requestsMonths.length; i++) {
                months.push(aesEncryption(requestsMonths[i].month.toString()));
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: months,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getRequestsDetails : (req, res) => {
        if (!req.query.year || !req.query.month) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const decYear = aesDecryption(req.query.year);
        let decMonth = aesDecryption(req.query.month);

        switch (decMonth)
        {
            case "January":
                {
                    decMonth = "1";
                    break;
                }
            case "February":
                {
                    decMonth = "2";
                    break;
                }
            case "March":
                {
                    decMonth = "3";
                    break;
                }
            case "April":
                {
                    decMonth = "4";
                    break;
                }
            case "May":
                {
                    decMonth = "5";
                    break;
                }
            case "June":
                {
                    decMonth = "6";
                    break;
                }
            case "July":
                {
                    decMonth = "7";
                    break;
                }
            case "August":
                {
                    decMonth = "8";
                    break;
                }
            case "September":
                {
                    decMonth = "9";
                    break;
                }
            case "October":
                {
                    decMonth = "10";
                    break;
                }
            case "November":
                {
                    decMonth = "11";
                    break;
                }
            case "December":
                {
                    decMonth = "12";
                    break;
                }
            default:
                break;
        }


        let newRequestsYears = 0;
        let newRequestsMonths = 0;
        let newRequestsDays = 0;
        let total = 0;

        getRequestsYearsDetailsOp((error, requestsYears) => {
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

            if (requestsYears.length === 1) {
                newRequestsYears =  0;
            }
            else{
                for (let i = 0; i < requestsYears.length; i++) {
                    total += requestsYears[i].requests_number;
                }

                newRequestsYears = total / requestsYears.length;
            }

            getRequestsMonthsDetailsOp(decYear, (error2, requestsMonths) => {
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

                if (requestsMonths.length === 1) {
                    newRequestsMonths = 0;
                }
                else{
                    for (let i = 0; i < requestsMonths.length; i++) {
                        newRequestsMonths += requestsMonths[i].requests_number;
                    }

                    newRequestsMonths /= requestsMonths.length;
                }


                getRequestsDaysDetailsOp(decYear, decMonth, (error3, requestsDays) => {
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

                    let newRequestsHours

                    if (requestsDays.length === 1) {
                        newRequestsDays = 0;
                        newRequestsHours = 0;
                    }
                    else{
                        for (let i = 0; i < requestsDays.length; i++) {
                            newRequestsDays += requestsDays[i].requests_number;
                        }

                        newRequestsHours = newRequestsDays / requestsDays.length * 24;
                        newRequestsDays /= requestsDays.length;
                    }

                     //The incrementing +1 very important for making charts
                    let newRequests = new Array();
                    let isFound = false;
                    if (requestsDays[0].month === 2) {

                        if (requestsDays[0].year % 4 === 0) {
                            for (let i = 0; i < 29 + 1; i++) {
                                if (i === 0) {
                                    newRequests.push({
                                        day: aesEncryption(i.toString()),
                                        requests_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < requestsDays.length; j++) {
                                        if (requestsDays[j].day === i) {
                                            newRequests.push({
                                                day: aesEncryption(requestsDays[j].day.toString()),
                                                requests_number: aesEncryption(requestsDays[j].requests_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newRequests.push({
                                            day: aesEncryption(i.toString()),
                                            requests_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                        else{
                            for (let i = 0; i < 28 + 1; i++) {
                                if (i === 0) {
                                    newRequests.push({
                                        day: aesEncryption(i.toString()),
                                        requests_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < requestsDays.length; j++) {
                                        if (requestsDays[j].day === i) {
                                            newRequests.push({
                                                day: aesEncryption(requestsDays[j].day.toString()),
                                                requests_number: aesEncryption(requestsDays[j].requests_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newRequests.push({
                                            day: aesEncryption(i.toString()),
                                            requests_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else{

                        //Month 4, 6, 8, 10, 12
                        if (requestsDays[0].month % 2 === 0) {
                            for (let i = 0; i < 30 + 1; i++) {
                                if (i === 0) {
                                    newRequests.push({
                                        day: aesEncryption(i.toString()),
                                        requests_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < requestsDays.length; j++) {
                                        if (requestsDays[j].day === i) {
                                            newRequests.push({
                                                day: aesEncryption(requestsDays[j].day.toString()),
                                                requests_number: aesEncryption(requestsDays[j].requests_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newRequests.push({
                                            day: aesEncryption(i.toString()),
                                            requests_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }

                        //Month 1, 3, 5, 7, 9, 11
                        else{
                            for (let i = 0; i < 31 + 1; i++) {
                                if (i === 0) {
                                    newRequests.push({
                                        day: aesEncryption(i.toString()),
                                        requests_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < requestsDays.length; j++) {
                                        if (requestsDays[j].day === i) {
                                            newRequests.push({
                                                day: aesEncryption(requestsDays[j].day.toString()),
                                                requests_number: aesEncryption(requestsDays[j].requests_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newRequests.push({
                                            day: aesEncryption(i.toString()),
                                            requests_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                    }


                    log.debug("Success operation");
                    return res.status(200).json({
                        response:{
                            result:{
                                requests_rad: newRequests,
                                per_year: aesEncryption(newRequestsYears.toFixed(3)),
                                per_month: aesEncryption(newRequestsMonths.toFixed(3)),
                                per_day: aesEncryption(newRequestsDays.toFixed(3)),
                                per_hour: aesEncryption(newRequestsHours.toFixed(3)),
                                total: aesEncryption(total.toString())  
                            }, 
                            token : req.accessToken ? req.accessToken : ""
                        },
                        errorMessage : ""
                    })
                });
            });
        });
    },


    //Reports controllers
    getReportsYears : (req, res) => {
        getReportsYearsOp((error, reportsYears) => {
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

            let years = new Array();
            for (let i = 0; i < reportsYears.length; i++) {
                years.push(aesEncryption(reportsYears[i].year.toString()));
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: years,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getReportsMonths : (req, res) => {
        if (!req.query.year) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const decYear = aesDecryption(req.query.year);

        getReportsMonthsOp(decYear, (error, reportsMonths) => {
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

            let months = new Array();
            for (let i = 0; i < reportsMonths.length; i++) {
                months.push(aesEncryption(reportsMonths[i].month.toString()));
            }

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: months,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getReportsDetails : (req, res) => {
        if (!req.query.year || !req.query.month) {
            log.error("Some parameters not found");
            return res.status(400).json({
                response: {
                    result: null,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: aesEncryption("Some parameters not found") 
            });
        }

        const decYear = aesDecryption(req.query.year);
        let decMonth = aesDecryption(req.query.month);

        switch (decMonth)
        {
            case "January":
                {
                    decMonth = "1";
                    break;
                }
            case "February":
                {
                    decMonth = "2";
                    break;
                }
            case "March":
                {
                    decMonth = "3";
                    break;
                }
            case "April":
                {
                    decMonth = "4";
                    break;
                }
            case "May":
                {
                    decMonth = "5";
                    break;
                }
            case "June":
                {
                    decMonth = "6";
                    break;
                }
            case "July":
                {
                    decMonth = "7";
                    break;
                }
            case "August":
                {
                    decMonth = "8";
                    break;
                }
            case "September":
                {
                    decMonth = "9";
                    break;
                }
            case "October":
                {
                    decMonth = "10";
                    break;
                }
            case "November":
                {
                    decMonth = "11";
                    break;
                }
            case "December":
                {
                    decMonth = "12";
                    break;
                }
            default:
                break;
        }


        let newReportsYears = 0;
        let newReportsMonths = 0;
        let newReportsDays = 0;
        let total = 0;

        getReportsYearsDetailsOp((error, reportsYears) => {
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

            if (reportsYears.length === 1) {
                newReportsYears =  0;
            }
            else{
                for (let i = 0; i < reportsYears.length; i++) {
                    total += reportsYears[i].reports_number;
                }

                newReportsYears = total / reportsYears.length;
            }

            getReportsMonthsDetailsOp(decYear, (error2, reportsMonths) => {
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

                if (reportsMonths.length === 1) {
                    newReportsMonths = 0;
                }
                else{
                    for (let i = 0; i < reportsMonths.length; i++) {
                        newReportsMonths += reportsMonths[i].reports_number;
                    }

                    newReportsMonths /= reportsMonths.length;
                }


                getReportsDaysDetailsOp(decYear, decMonth, (error3, reportsDays) => {
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

                    let newReportsHours

                    if (reportsDays.length === 1) {
                        newReportsDays = 0;
                        newReportsHours = 0;
                    }
                    else{
                        for (let i = 0; i < reportsDays.length; i++) {
                            newReportsDays += reportsDays[i].reports_number;
                        }

                        newReportsHours = newReportsDays / reportsDays.length * 24;
                        newReportsDays /= reportsDays.length;
                    }

                     //The incrementing +1 very important for making charts
                    let newReports = new Array();
                    let isFound = false;
                    if (reportsDays[0].month === 2) {

                        if (reportsDays[0].year % 4 === 0) {
                            for (let i = 0; i < 29 + 1; i++) {
                                if (i === 0) {
                                    newReports.push({
                                        day: aesEncryption(i.toString()),
                                        reports_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < reportsDays.length; j++) {
                                        if (reportsDays[j].day === i) {
                                            newReports.push({
                                                day: aesEncryption(reportsDays[j].day.toString()),
                                                reports_number: aesEncryption(reportsDays[j].reports_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newReports.push({
                                            day: aesEncryption(i.toString()),
                                            reports_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                        else{
                            for (let i = 0; i < 28 + 1; i++) {
                                if (i === 0) {
                                    newReports.push({
                                        day: aesEncryption(i.toString()),
                                        reports_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < reportsDays.length; j++) {
                                        if (reportsDays[j].day === i) {
                                            newReports.push({
                                                day: aesEncryption(reportsDays[j].day.toString()),
                                                reports_number: aesEncryption(reportsDays[j].reports_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newReports.push({
                                            day: aesEncryption(i.toString()),
                                            reports_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else{

                        //Month 4, 6, 8, 10, 12
                        if (reportsDays[0].month % 2 === 0) {
                            for (let i = 0; i < 30 + 1; i++) {
                                if (i === 0) {
                                    newReports.push({
                                        day: aesEncryption(i.toString()),
                                        reports_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < reportsDays.length; j++) {
                                        if (reportsDays[j].day === i) {
                                            newReports.push({
                                                day: aesEncryption(reportsDays[j].day.toString()),
                                                reports_number: aesEncryption(reportsDays[j].reports_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newReports.push({
                                            day: aesEncryption(i.toString()),
                                            reports_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }

                        //Month 1, 3, 5, 7, 9, 11
                        else{
                            for (let i = 0; i < 31 + 1; i++) {
                                if (i === 0) {
                                    newReports.push({
                                        day: aesEncryption(i.toString()),
                                        reports_number: aesEncryption("0") 
                                    });
                                }
                                else{
                                    isFound = false;
                                    for (let j = 0; j < reportsDays.length; j++) {
                                        if (reportsDays[j].day === i) {
                                            newReports.push({
                                                day: aesEncryption(reportsDays[j].day.toString()),
                                                reports_number: aesEncryption(reportsDays[j].reports_number.toString()) 
                                            });
                
                                            isFound = true;
                                            break;
                                        }
                                    }
                
                                    if (!isFound) {
                                        newReports.push({
                                            day: aesEncryption(i.toString()),
                                            reports_number: aesEncryption("0") 
                                        });
                                    }
                                }
                            }
                        }
                    }


                    log.debug("Success operation");
                    return res.status(200).json({
                        response:{
                            result:{
                                reports_rad: newReports,
                                per_year: aesEncryption(newReportsYears.toFixed(3)),
                                per_month: aesEncryption(newReportsMonths.toFixed(3)),
                                per_day: aesEncryption(newReportsDays.toFixed(3)),
                                per_hour: aesEncryption(newReportsHours.toFixed(3)),
                                total: aesEncryption(total.toString()) 
                            }, 
                            token : req.accessToken ? req.accessToken : ""
                        },
                        errorMessage : ""
                    })
                });
            });
        });
    },

}