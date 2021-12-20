
const router = require('express').Router();
const {verifyAccessToken} = require('../../../security/jwt_authorization');
const {
    getAdminProfile, 
    updateAdminProfile,
    requestFacebookId,
    addFacebookAccount,
    requestMicrosoftId,
    addMicrosoftAccount
} = require('./setting.controller');


router.get('/get-admin-profile', verifyAccessToken, getAdminProfile);
router.put('/update-admin-profile', verifyAccessToken, updateAdminProfile);

router.get('/request-facebook-id', verifyAccessToken, requestFacebookId);
router.put('/add-facebook-account', verifyAccessToken, addFacebookAccount);

router.get('/request-microsoft-id', verifyAccessToken, requestMicrosoftId);
router.put('/add-microsoft-account', verifyAccessToken, addMicrosoftAccount);

module.exports = router;