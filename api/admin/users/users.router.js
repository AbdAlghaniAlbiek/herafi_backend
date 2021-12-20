const router = require('express').Router();
const {verifyAccessToken} = require('../../../security/jwt_authorization');
const {
    getGeneralUsers,
    getUserDetailsProfile,
    getUserDetailsRequests,
    getNewMemberUser,
    acceptNewMemberUser,
    refuseNewMemberUser,
    getNewMembersUsersIds
} = require('./users.controller');

router.get('/get-general-users', verifyAccessToken, getGeneralUsers);
router.get('/get-user-details-profile', verifyAccessToken, getUserDetailsProfile);
router.get('/get-user-details-requests', verifyAccessToken, getUserDetailsRequests)

router.get('/get-new-members-users-ids', getNewMembersUsersIds)
router.get('/get-new-member-user', verifyAccessToken, getNewMemberUser)
router.post('/accept-new-member-user', verifyAccessToken, acceptNewMemberUser)
router.delete('/refuse-new-member-user', verifyAccessToken, refuseNewMemberUser)


module.exports = router;