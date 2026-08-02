const express=require("express");
const{createTask,updateTask,getTasks,deleteTask}=require('../controllers/taskController');
const authMiddleware=require('../middleware/authMiddleware');

const routes=express.Router();

routes.post('/create/:projectId',authMiddleware,createTask);
routes.get('/get/:projectId',authMiddleware,getTasks);
routes.put('/update/:projectId/:taskId',authMiddleware, updateTask);
routes.delete('/delete/:id',authMiddleware, deleteTask);

module.exports=routes;