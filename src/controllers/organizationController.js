const prisma=require('../config/prisma')
const createOrganization = async (req, res) => {
    const{name}=req.body;
    const creatorId=req.user.userId;
    console.log(req.user);

    if (!name || !name.trim()) {
    return res.status(400).json({
        message: "Organization name is required"
    });
}

    try {
        const organization=await prisma.$transaction(async(tx)=>{

        const newOrganization= await tx.organization.create({
            data:{
                name,
                creatorId
            }
        });
        await tx.organizationMember.create({
            data:{
                userId:creatorId,
                organizationId:newOrganization.id,
                role: "OWNER"
            }
        });

        return newOrganization;

        });

      return res.status(201).json({message:"organization created successfully",
        organization
      });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const updateOrganization = async (req, res) => {
    const organizationId=Number(req.params.id);
    const {name}=req.body;
    const userId=req.user.userId;
    if(!name || !name.trim()){
        return res.status(400).json({message:"name must be given to update"})
    }
    
    try {
        const member=await prisma.organizationMember.findFirst({
            where:{
                organizationId,
                userId
            }
        })
        if(!member){
            return res.status(403).json({message:"You are not a member of this organization"})
        }
         if(member.role!=="OWNER"){
            return res.status(403).json({message:"Only owners can update the organizationt"})
        }
        const updatedOrganization=await prisma.organization.update({
            where:{
                id:organizationId
            },
            data:{
                name,
            }
        });
        return res.status(200).json({message:"updated successfully",organization:updatedOrganization});
    } 
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const getOrganizations = async (req, res) => {
    const userId=req.user.userId;

    try {
        const memberships=await prisma.organizationMember.findMany({
            where:{
                userId
            },
            include:{
                organization:true
            }
        });

        res.status(200).json({memberships})
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


const deleteOrganization = async (req, res) => {
    const{organizationId}=req.params;
    const userId=req.user.userId;
    const organizationIdNumber = Number(organizationId);
    
    try {

        const membership=await prisma.organizationMember.findFirst({
            where:{
                userId,
                organizationId:organizationIdNumber
            }
        });
        if(!membership) {
    return res.status(403).json({
        message: "You are not a member of this organization."
    });
        }
         
        if(membership.role!=="OWNER"){
            return res.status(403).json({message:"Only owners can delete the organizationt"});
        }
        const deletedOrganization=await prisma.organization.delete(
            {
                where:{
                    id:organizationIdNumber
                }
            }
        );

        res.status(200).json({message:"organization deleted"});

    } 
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


module.exports = {
    createOrganization,
    updateOrganization,
    getOrganizations,
    deleteOrganization,
};