const prisma=require('../config/prisma');
const getActivity = async (req, res) => {
    const projectId = Number(req.params.projectId);
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

        const activities = await prisma.activity.findMany({
            where: {
                projectId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                task: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            message: "Activities fetched successfully.",
            activities
        });

    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports={getActivity};