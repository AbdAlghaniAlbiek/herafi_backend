const router = require('express').Router();
const {verifyAccessToken} = require('../../../security/jwt_authorization');
const {
    getGeneralCraftmen,
    getCraftmanDetailsProfile,
    getCraftmanDetailsCrafts,
    getCraftmanDetailsCertifications,
    getCraftmanDetailsRequests,
    getCraftmanDetailsProjects,

    getNewMembersCraftmenIds,
    getNewMemberCraftman,
    acceptNewMemberCraftman,
    refuseNewMemberCraftman,

    getReportedCraftman,
    blockingCraftman,
    firingCraftman,
    getBlockingFiringsCraftmenNumber,
    getReportedBlockingCraftmenIds,
    getReportedFiringCraftmenIds
} = require('./craftmen.controller');

router.get('/get-general-craftmen', verifyAccessToken, getGeneralCraftmen);
router.get('/get-craftman-details-profile', verifyAccessToken, getCraftmanDetailsProfile);
router.get('/get-craftman-details-crafts', verifyAccessToken, getCraftmanDetailsCrafts);
router.get('/get-craftman-details-certifications', verifyAccessToken, getCraftmanDetailsCertifications);
router.get('/get-craftman-details-requests', verifyAccessToken, getCraftmanDetailsRequests);
router.get('/get-craftman-details-projects', verifyAccessToken, getCraftmanDetailsProjects);

router.get('/get-new-members-craftmen-ids', verifyAccessToken, getNewMembersCraftmenIds);
router.get('/get-new-member-craftman', verifyAccessToken, getNewMemberCraftman);
router.post('/accept-new-member-craftman', verifyAccessToken, acceptNewMemberCraftman);
router.delete('/refuse-new-member-craftman', verifyAccessToken, refuseNewMemberCraftman);


router.get('/get-blockings-firings-craftmen-number', verifyAccessToken, getBlockingFiringsCraftmenNumber);
router.get('/get-reported-blocking-craftmen-ids', verifyAccessToken, getReportedBlockingCraftmenIds);
router.get('/get-reported-firing-craftmen-ids', verifyAccessToken, getReportedFiringCraftmenIds)
router.get('/get-reported-craftman', verifyAccessToken, getReportedCraftman);
router.put('/blocking-craftman', verifyAccessToken, blockingCraftman);
router.delete('/firing-craftman', verifyAccessToken, firingCraftman);


module.exports = router;