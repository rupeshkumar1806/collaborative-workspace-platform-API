const express=require("express");
const{getActivity}=require('../controllers/activityController');
const authMiddleware=require('../middleware/authMiddleware');

const routes=express.Router();

routes.get('/get/:projectId', authMiddleware,getActivity);


module.exports=routes;

