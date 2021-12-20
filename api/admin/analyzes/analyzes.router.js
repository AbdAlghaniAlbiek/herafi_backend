let router = require('express').Router();

const {
    getCraftmenDetails,
    getCraftmenMonths,
    getCraftmenYears,

    getProfitsMonths,
    getProfitsYears,
    getProfitsDetails,

    getReportsDetails,
    getReportsMonths,
    getReportsYears,

    getRequestsDetails,
    getRequestsMonths,
    getRequestsYears,

    getUsersDetails,
    getUsersMonths,
    getUsersYears

} = require('./analyzes.controller');


router.get('/get-profits-years', getProfitsYears);
router.get('/get-profits-months', getProfitsMonths);
router.get('/get-profits-details', getProfitsDetails);

router.get('/get-craftmen-years', getCraftmenYears);
router.get('/get-craftmen-months', getCraftmenMonths);
router.get('/get-craftmen-details', getCraftmenDetails);

router.get('/get-users-years', getUsersYears);
router.get('/get-users-months', getUsersMonths);
router.get('/get-users-details', getUsersDetails);

router.get('/get-requests-years', getRequestsYears);
router.get('/get-requests-months', getRequestsMonths);
router.get('/get-requests-details', getRequestsDetails);

router.get('/get-reports-years', getReportsYears);
router.get('/get-reports-months', getReportsMonths);
router.get('/get-reports-details', getReportsDetails);

module.exports = router;

