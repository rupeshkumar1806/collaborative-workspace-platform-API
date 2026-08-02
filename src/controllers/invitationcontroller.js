const prisma=require('../config/prisma');

const inviteOrganizationMember = async (req, res) => {
    const { email, role } = req.body;
    const organizationId = Number(req.params.organizationId);
    const userId = req.user.userId;

    // Invitation expires in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Validate input
    if (!email || !role) {
        return res.status(400).json({
            message: "Email and role are required."
        });
    }

    // Validate role
    const allowedRoles = ["MEMBER", "ADMIN", "VIEWER"];

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            message: "Invalid role."
        });
    }

    try {

        // Check inviter belongs to organization
        const membership = await prisma.organizationMember.findUnique({
            where: {
                organizationId_userId: {
                    organizationId,
                    userId
                }
            }
        });

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this organization."
            });
        }

        // Only OWNER or ADMIN can invite
        if (
            membership.role !== "OWNER" &&
            membership.role !== "ADMIN"
        ) {
            return res.status(403).json({
                message: "Only owner or admin can invite members."
            });
        }

        // Check duplicate invitation
        const existingInvitation = await prisma.invitation.findUnique({
            where: {
                organizationId_email: {
                    organizationId,
                    email
                }
            }
        });

        if (existingInvitation) {
            return res.status(409).json({
                message: "Invitation already exists."
            });
        }

        // Check if user already exists
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (user) {

            const existingMember = await prisma.organizationMember.findUnique({
                where: {
                    organizationId_userId: {
                        organizationId,
                        userId: user.id
                    }
                }
            });

            if (existingMember) {
                return res.status(409).json({
                    message: "User is already a member of this organization."
                });
            }
        }

        // Create invitation
        const invitation = await prisma.invitation.create({
            data: {
                email,
                role,
                organizationId,
                invitedBy: userId,
                expiresAt
            }
        });

        return res.status(201).json({
            message: "Invitation sent successfully.",
            invitation
        });

    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};