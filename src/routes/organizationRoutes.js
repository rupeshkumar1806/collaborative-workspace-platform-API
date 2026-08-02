const express=require("express");
const{ createOrganization,updateOrganization,getOrganizations,deleteOrganization}=require('../controllers/organizationController');
const authMiddleware=require('../middleware/authMiddleware');

const routes=express.Router();

routes.post('/create',authMiddleware,createOrganization);
routes.get('/get',getOrganizations);
routes.put('/update', updateOrganization);
routes.delete('/delete', deleteOrganization);

module.exports=routes;

