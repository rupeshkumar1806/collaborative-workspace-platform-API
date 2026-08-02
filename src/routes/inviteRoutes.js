const express=require("express");
const{ inviteOrganizationMember,getinvitedMember}=require('../controllers/invitationcontroller');
const authMiddleware=require('../middleware/authMiddleware');

const routes=express.Router();

routes.post('/send/:organizationId',authMiddleware,inviteOrganizationMember);
routes.get('/get/:organizationId', authMiddleware,getinvitedMember);

module.exports=routes;

