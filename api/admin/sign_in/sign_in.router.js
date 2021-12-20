const router = require('express').Router();
const {verifyAccessToken} = require('../../../security/jwt_authorization');
const {
    getCities,
    signUpAdmin,
    requestFacebookId,
    signUpWithFacebookId,
    requestMicrosoftId,
    signUpWithMicrosoftId,
    verifyAdmin,
    signInAdmin,
    directSignInAdmin,
    directSignInWithFacebookId,
    directSignInWithMicrosoftId,
    checkIdentity,
    verificationIdentity,
    resetPassword,
    uploadPersonalIdentityImage,
    uploadProfileImage
} = require('./sign_in.controller');


router.get('/get-cities', getCities);
router.post('/sign-up-admin', signUpAdmin);

router.get('/request-facebook-id', requestFacebookId);
router.post('/sign-up-facebook-id', signUpWithFacebookId);

router.get('/request-microsoft-id', requestMicrosoftId);
router.post('/sign-up-microsoft-id', signUpWithMicrosoftId);

router.post('/verify-admin', verifyAdmin);

router.post('/upload-profile-image', verifyAccessToken, uploadProfileImage);
router.post('/upload-personal-identity-image', verifyAccessToken, uploadPersonalIdentityImage);

router.post('/sign-in-admin', signInAdmin);
router.post('/direct-sign-in-admin', directSignInAdmin);
router.post('/direct-sign-in-facebook-id', directSignInWithFacebookId);
router.post('/direct-sign-in-microsoft-id', directSignInWithMicrosoftId);
router.post('/check-identity', checkIdentity);
router.post('/verification-identity', verificationIdentity);
router.put('/reset-password', verifyAccessToken, resetPassword);


module.exports = router;