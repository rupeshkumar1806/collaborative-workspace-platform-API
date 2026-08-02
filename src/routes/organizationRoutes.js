const express=require("express");
const{ createOrganization,updateOrganization,getOrganizations,deleteOrganization}=require('../controllers/organizationController');
const authMiddleware=require('../middleware/authMiddleware');

const routes=express.Router();

routes.post('/create',authMiddleware,createOrganization);
routes.get('/get', authMiddleware,getOrganizations);
routes.put('/update/:id',authMiddleware, updateOrganization);
routes.delete('/delete/:id',authMiddleware, deleteOrganization);

module.exports=routes;

