const router = require('express').Router();
const {verifyAccessToken} = require('../../../security/jwt_authorization');
const {
    getProfitsDetails,
    getNewMembers
} = require('./dashboard.controller');

router.get('/get-profits-details', verifyAccessToken, getProfitsDetails);
router.get('/get-new-members', getNewMembers);


module.exports = router;