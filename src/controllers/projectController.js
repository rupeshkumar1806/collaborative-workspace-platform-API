const prisma=require('../config/prisma')
const createProject = async (req, res) => {
    const{name,description,startDate,dueDate}=req.body;
    const organizationId= Number(req.params.organizationId);
    const userId=req.user.userId;

    if (!name || !name.trim()) {
    return res.status(400).json({
        message: "Project name is required"
    });
}

    try {

        const member=await prisma.organizationMember.findUnique({
            where:{
                organizationId_userId:{
                    userId,
                    organizationId
                }
            }});

            if (!member) {
    return res.status(403).json({
        message: "You are not a member of this organization."
    });
}

            if(member.role!=="OWNER"){
                return res.status(403).json({message:"only owner can create projects"});
            }

        const project=await prisma.$transaction(async(tx)=>{

        const newProject= await tx.project.create({
            data:{
                name,
                organizationId,
                ownerId:userId,
                description,
                startDate,
                dueDate
            }
        });
        await tx.projectMember.create({
            data:{
                projectId:newProject.id,
                userId,
                role:"MANAGER"
            }
        });

        return newProject;

        });

      return res.status(201).json({message:"project created successfully",
        project
      });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const updateProject = async (req, res) => {
    const projectId=Number(req.params.id);
    const {name}=req.body;
    const userId=req.user.userId;
    if(!name || !name.trim()){
        return res.status(400).json({message:"name must be given to update"})
    }

    
    try {
    
        const member=await prisma.projectMember.findUnique({
            where:{
                projectId_userId:{

                projectId,
                userId
                }
            }
        })
        if(!member){
            return res.status(403).json({message:"You are not a member of this project"})
        }
         if(member.role!=="MANAGER"){
            return res.status(403).json({message:"Only managers can update the project"})
        }

              const project = await prisma.project.findUnique({
        where: {
         id: projectId
     }
        });

if (!project) {
    return res.status(404).json({
        message: "Project not found"
    });
}
        const updatedProject=await prisma.project.update({
            where:{
                id:projectId
            },
            data:{
                name,
            }
        });
        return res.status(200).json({message:"updated successfully",project:updatedProject});
    } 
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const getProjects = async (req, res) => {
    const userId=req.user.userId;
    const organizationId= Number(req.params.organizationId);
    

    try {

       const member = await prisma.organizationMember.findUnique({
    where: {
        organizationId_userId: {
            organizationId,
            userId
        }
    }
});

if (!member) {
    return res.status(403).json({
        message: "You are not a member of this organization."
    });
}
   const projects=await prisma.project.findMany({
    where:{
        organizationId
    },
    orderBy:{
        createdAt:"desc",
    }
   })

        res.status(200).json({projects});
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


const deleteProject = async (req, res) => {
    const userId=req.user.userId;
    const projectId = Number(req.params.projectId);
    
    try {

         const member=await prisma.projectMember.findUnique({
            where:{
                projectId_userId:{
                    projectId,
                    userId
                }
            }
         });
        if(!member) {
    return res.status(403).json({
        message: "You are not a member of this project."
    });
        }
         
        if(member.role!=="MANAGER"){
            return res.status(403).json({message:"Only managers can delete the prjects"});
        }
        const deletedProject=await prisma.project.delete(
            {
                where:{
                    id:projectId
                }
            }
        );

       return res.status(200).json({message:"project deleted"});

    } 
    catch (e) {
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