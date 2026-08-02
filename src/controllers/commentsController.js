const prisma=require('../config/prisma');

const createComment = async (req, res) => {
    const { content } = req.body;

    const taskId = Number(req.params.taskId);
    const userId = req.user.userId;

    // Validate comment
    if (!content || !content.trim()) {
        return res.status(400).json({
            message: "Comment content is required."
        });
    }

    try {

        // Check task exist
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

        // Check user belongs to project
        const member = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId: task.projectId,
                    userId
                }
            }
        });

        if (!member) {
            return res.status(403).json({
                message: "You are not a member of this project."
            });
        }

        // Create comment
        const comment = await prisma.comment.create({
            data: {
                message:content,
                taskId,
                userId
            }
        });

        return res.status(201).json({
            message: "Comment created successfully.",
            comment
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const getComments = async (req, res) => {
    const taskId = Number(req.params.taskId);
    const userId = req.user.userId;

    try {

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

        const member = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId: task.projectId,
                    userId
                }
            }
        });

        if (!member) {
            return res.status(403).json({
                message: "You are not a member of this project."
            });
        }

        const comments = await prisma.comment.findMany({
            where: {
                taskId
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        return res.status(200).json({
            comments
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const updateComment = async (req, res) => {
    const commentId = Number(req.params.id);
    const userId = req.user.userId;
    const { content } = req.body;

    if (!content || !content.trim()) {
        return res.status(400).json({
            message: "Comment content is required."
        });
    }

    try {

        const comment = await prisma.comment.findUnique({
            where: {
                id: commentId
            }
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found."
            });
        }

        if (comment.userId !== userId) {
            return res.status(403).json({
                message: "You can only update your own comments."
            });
        }

        const updatedComment = await prisma.comment.update({
            where: {
                id: commentId
            },
            data: {
                message:content,
            }
        });

        return res.status(200).json({
            message: "Comment updated successfully.",
            comment: updatedComment
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const deleteComment = async (req, res) => {
    const commentId = Number(req.params.id);
    const userId = req.user.userId;

    try {

        const comment = await prisma.comment.findUnique({
            where: {
                id: commentId
            }
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found."
            });
        }

        if (comment.userId !== userId) {
            return res.status(403).json({
                message: "You can only delete your own comments."
            });
        }

        await prisma.comment.delete({
            where: {
                id: commentId
            }
        });

        return res.status(200).json({
            message: "Comment deleted successfully."
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports={createComment,getComments,updateComment,deleteComment};