const express=require("express");
const{createComment,getComments,updateComment,deleteComment}=require('../controllers/commentsController');
const authMiddleware=require('../middleware/authMiddleware');

const routes=express.Router();

routes.post('/create/:taskId',authMiddleware,createComment);
routes.get('/get/:taskId', authMiddleware,getComments);
routes.put('/update/:id',authMiddleware, updateComment);
routes.delete('/delete/:id',authMiddleware, deleteComment);

module.exports=routes;

