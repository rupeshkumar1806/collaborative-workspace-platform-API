const prisma=require('../config/prisma');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const registerUser=async(req,res)=>{

const{name,email,password}=req.body;

try{
    
    const alreadyExist=await prisma.user.findUnique({
        where:{
            email
        }
    });

    if(alreadyExist){

        return res.status(409).send({"message":"email already exist"});
    }

    const hashPassword=await bcrypt.hash(password,10);

    const createUser=await prisma.user.create(
        {
            data:{
                name,
                email,
                password:hashPassword
            }
        });

        return res.status(201).send({"message":"User registerd successfully"});
}
catch(e){

    console.log("error",e);
    return res.status(400).send({"message":"invalid register"});

}
}

const loginUser=async(req,res)=>{
    const{email,password}=req.body;

    try{
        const user=await prisma.user.findUnique({
            where:{
                email
            }
        });

        if(!user){
            return res.status(400).send({"message":"no user found"});
        }

        const verifyPassword=await bcrypt.compare(password,user.password);

        if(!verifyPassword){
            return res.status(401).send({"message":"inavlid password or email"});
        }

        const accessToken=generateAccessToken(user);
       // const refreshToken=generateRefreshToken(user);

        res.status(200).send({"accessToken":accessToken});
        
    }
    catch(e){
        console.log("error",e);
        return res.status(400).send({"message":"invalid user credential"});
    }
}

const authReferesh=async()=>{
 
    try{

    }
    catch(e){
        console.log("error",e);
        return res.status(400).send({"message":"invalid user credential"});
    }
}


const generateAccessToken=(user)=>{

    const payload={
     userId:user.id
    };
    const accessToken=jwt.sign(payload,process.env.JWT_KEY,{
        expiresIn:"15m"
    });
    console.log("JWT_KEY during sign:", process.env.JWT_KEY);

    console.log("Generated:", accessToken);
    console.log("Verified:", jwt.verify(accessToken, process.env.JWT_KEY));

    return accessToken;
}

module.exports={registerUser,loginUser};