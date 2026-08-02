const prisma=require('../config/prisma')
const createTask = async (req, res) => {
    const { title, description, assignee, dueDate } = req.body;

    const assigneeId = Number(assignee);
    const projectId = Number(req.params.projectId);
    const userId = req.user.userId;

    if (!title || !title.trim()) {
        return res.status(400).json({
            message: "Task title is required."
        });
    }

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

        // Only managers can create tasks
        if (member.role !== "MANAGER") {
            return res.status(403).json({
                message: "Only managers can create tasks."
            });
        }

        // Check assignee belongs to project
        const assigneeMember = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId: assigneeId
                }
            }
        });

        if (!assigneeMember) {
            return res.status(403).json({
                message: "Assignee is not a member of this project."
            });
        }

        // Get project
        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        // Transaction
        const task = await prisma.$transaction(async (tx) => {

            const newTask = await tx.task.create({
                data: {
                    title,
                    description,
                    projectId,
                    createdBy: userId,
                    assignedTo: assigneeId,
                    dueDate
                }
            });

            await tx.activity.create({
                data: {
                    userId,
                    organizationId: project.organizationId,
                    projectId,
                    taskId: newTask.id,
                    action: "CREATE_TASK",
                    description: `Created task "${newTask.title}"`
                }
            });

            return newTask;
        });

        return res.status(201).json({
            message: "Task created successfully.",
            task
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

        if (member.role !== "MANAGER") {
            return res.status(403).json({
                message: "Only managers can update tasks."
            });
        }

        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        const task = await prisma.task.findUnique({
            where: {
                id: taskId
            }
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        const data = {};

        if (title !== undefined) data.title = title;
        if (description !== undefined) data.description = description;
        if (dueDate !== undefined) data.dueDate = dueDate;
        if (status !== undefined) data.status = status;

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

        const updatedTask = await prisma.$transaction(async (tx) => {

            const updated = await tx.task.update({
                where: {
                    id: taskId
                },
                data
            });

            await tx.activity.create({
                data: {
                    userId,
                    organizationId: project.organizationId,
                    projectId,
                    taskId,
                    action: "UPDATE_TASK",
                    description: `Updated task "${updated.title}"`
                }
            });

            return updated;
        });

        return res.status(200).json({
            message: "Task updated successfully.",
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
            },
            include:{
                project:true,
            }
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        

        await prisma.$transaction(async (tx) => {

            await tx.activity.create({
                data: {
                    userId,
                    organizationId: task.project.organizationId,
                    projectId,
                    taskId,
                    action: "DELETE_TASK",
                    description: `Deleted task "${task.title}"`
                }
            });

            await tx.task.delete({
                where: {
                    id: taskId
                }
            });

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
    createTask,
    updateTask,
    getTasks,
    deleteTask
};