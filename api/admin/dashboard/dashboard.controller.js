const {
    LoggerService,
    appType
} = require('../../../services/logging');
const {
    getProfitsPerDaysOp,
    getNewMembersOp
} = require('./dahsboard.service');
const {
    aesEncryption
} = require('../../../security/aes_algorithm');

const log = new LoggerService("craftmen", appType.admin, false);

module.exports = {

    getProfitsDetails : (req, res) => {

        getProfitsPerDaysOp((error, profits) => {
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

            //The incrementing +1 very important for making charts
            let newProfits = new Array();
            let isFound = false;
            if (profits[0].last_month === 2) {

                if (profits[0].lasy_year % 4 === 0) {
                    for (let i = 0; i < 29 + 1; i++) {
                        if (i === 0) {
                            newProfits.push({
                                day: aesEncryption(i.toString()),
                                paids: aesEncryption("0") 
                            });
                        }
                        else{
                            isFound = false;
                            for (let j = 0; j < profits.length; j++) {
                                if (profits[j].day === i) {
                                    newProfits.push({
                                        day: aesEncryption(profits[j].day.toString()),
                                        paids: aesEncryption(profits[j].paids.toString()) 
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
                            for (let j = 0; j < profits.length; j++) {
                                if (profits[j].day === i) {
                                    newProfits.push({
                                        day: aesEncryption(profits[j].day.toString()),
                                        paids: aesEncryption(profits[j].paids.toString()) 
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
                if (profits[0].last_month % 2 === 0) {
                    for (let i = 0; i < 30 + 1; i++) {
                        if (i === 0) {
                            newProfits.push({
                                day: aesEncryption(i.toString()),
                                paids: aesEncryption("0") 
                            });
                        }
                        else{
                            isFound = false;
                            for (let j = 0; j < profits.length; j++) {
                                if (profits[j].day === i) {
                                    newProfits.push({
                                        day: aesEncryption(profits[j].day.toString()),
                                        paids: aesEncryption(profits[j].paids.toString()) 
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
                            for (let j = 0; j < profits.length; j++) {
                                if (profits[j].day === i) {
                                    newProfits.push({
                                        day: aesEncryption(profits[j].day.toString()),
                                        paids: aesEncryption(profits[j].paids.toString()) 
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

            let total = 0;
            let count = 0;
            for (let i = 0; i < profits.length; i++) {
                total += profits[i].paids;
                count++;
            }

            let profitsPrecentage = ( profits[profits.length - 1].paids - (profits.length !== 1 ? profits[profits.length - 2].paids : 0) ) / (profits.length !== 1 ? profits[profits.length - 2].paids : profits[profits.length - 1].paids);
            let compProfitsPrecentage = (profitsPrecentage === 1 ?  profitsPrecentage - 1 : profitsPrecentage) * 100;
             
            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result: {
                        total: aesEncryption(total.toString()),
                        per_day: aesEncryption((total/count) === total ? (0).toString() : (total/count).toFixed(3)),
                        per_hour: aesEncryption(total/(count * 24) === total / 24 ? (0).toString() : (total/(count * 24)).toFixed(3)),
                        profits_precentage: aesEncryption(compProfitsPrecentage.toString()),
                        profits: newProfits
                    },
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        });
    },

    getNewMembers : (req, res) => {

        getNewMembersOp((error, newMemebers) => {
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

            newMemebers.new_members_craftmen_num = aesEncryption(newMemebers.new_members_craftmen_num.toString());
            newMemebers.new_members_users_num = aesEncryption(newMemebers.new_members_users_num.toString());

            log.debug("Success operation");
            return res.status(200).json({
                response: {
                    result:newMemebers,
                    token: req.accessToken ? req.accessToken : ""
                },
                errorMessage: ""
            });
        })
    }
}
