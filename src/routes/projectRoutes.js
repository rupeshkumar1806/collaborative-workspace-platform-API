const express=require("express");
const{ createProject,updateProject,getProjects,deleteProject}=require('../controllers/projectController');
const authMiddleware=require('../middleware/authMiddleware');

const routes=express.Router();

routes.post('/create/:organizationId',authMiddleware,createProject);
routes.get('/get/:organizationId',authMiddleware,getProjects);
routes.put('/update/:id',authMiddleware, updateProject);
routes.delete('/delete/:id',authMiddleware, deleteProject);

module.exports=routes;