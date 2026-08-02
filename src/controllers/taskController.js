const prisma=require('../config/prisma')
const createTask= async (req, res) => {
    const{title,description,assignee,dueDate}=req.body;
    const assigneeId=Number(assignee);
    const projectId= Number(req.params.projectId);
    const userId=req.user.userId;

    if (!title || !title.trim()) {
    return res.status(400).json({
        message: "task name is required"
    });
}

    try {

        const member=await prisma.projectMember.findUnique({
            where:{
                projectId_userId:{
                    userId,
                    projectId
                }
            }});

            if (!member) {
    return res.status(403).json({
        message: "You are not a member of this project."
    });
}

            if(member.role!=="MANAGER"){
                return res.status(403).json({message:"only manager can create tasks"});
            }

               const assigneeMembership=await prisma.projectMember.findUnique({
            where:{
                projectId_userId:{
                     projectId,
                userId:assigneeId,
                }
            }
        });
        if(!assigneeMembership){
            return res.status(403).json({message:"assignee is not a memeber of project"});
        }

        const newTask= await prisma.task.create({
            data:{
                title,
                description,
                projectId,
                createrBy:userId,
                assignedTo:assigneeId,
                dueDate,
            }
        });

      return res.status(201).json({
    message: "Task created successfully",
    task: newTask
});
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const updateTask = async (req, res) => {
    const { title, description, assigneeId, dueDate, status } = req.body;

    const projectId = Number(req.params.projectId);
    const taskId = Number(req.params.taskId);
    const userId = req.user.userId;

    try {

        // Check if user belongs to project
        const member = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId
                }
            }
        });

        if (!member) {
            return res.status(403).json({
                message: "You are not a member of this project."
            });
        }

        // Only managers can update task details
        if (member.role !== "MANAGER") {
            return res.status(403).json({
                message: "Only managers can update tasks."
            });
        }

        // Check task exists and belongs to this project
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                projectId
            }
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        // Build update object
        const data = {};

        if (title !== undefined) {
            data.title = title;
        }

        if (description !== undefined) {
            data.description = description;
        }

        if (dueDate !== undefined) {
            data.dueDate = dueDate;
        }

        if (status !== undefined) {
            data.status = status;
        }

        // Validate new assignee
        if (assigneeId !== undefined) {

            const assigneeMember = await prisma.projectMember.findUnique({
                where: {
                    projectId_userId: {
                        projectId,
                        userId: assigneeId
                    }
                }
            });

            if (!assigneeMember) {
                return res.status(400).json({
                    message: "Assignee is not a member of this project."
                });
            }

            data.assignedTo = assigneeId;
        }

        // Update task
        const updatedTask = await prisma.task.update({
            where: {
                id: taskId
            },
            data
        });

        return res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const getTasks = async (req, res) => {
    const projectId = Number(req.params.projectId);
    const userId = req.user.userId;

    try {

        // Check if user is a member of the project
        const member = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId
                }
            }
        });

        if (!member) {
            return res.status(403).json({
                message: "You are not a member of this project."
            });
        }

        // Get all tasks of the project
        const tasks = await prisma.task.findMany({
            where: {
                projectId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            tasks
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


const deleteTask = async (req, res) => {
    const projectId = Number(req.params.projectId);
    const taskId = Number(req.params.taskId);
    const userId = req.user.userId;

    try {

        // Check project membership
        const member = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId
                }
            }
        });

        if (!member) {
            return res.status(403).json({
                message: "You are not a member of this project."
            });
        }

        // Only managers can delete tasks
        if (member.role !== "MANAGER") {
            return res.status(403).json({
                message: "Only managers can delete tasks."
            });
        }

        // Check task exists
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                projectId
            }
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        // Delete task
        await prisma.task.delete({
            where: {
                id: taskId
            }
        });

        return res.status(200).json({
            message: "Task deleted successfully."
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createProject,
    updateProject,
    getProjects,
    deleteProject
};