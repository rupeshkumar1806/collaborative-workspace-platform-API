const jwt=require("jsonwebtoken");
require("dotenv").config();

const authMiddleware=async(req,res,next)=>{
  const authHeader=req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
        message: "No authentication token"
    });
    console.log("Authorization:", req.headers.authorization);
}

  const token=authHeader.split(" ")[1];
  console.log("Token:", JSON.stringify(token));

    try{
            if(!token){
                return res.status(401).send({"message":"no authentication token"});
            }
            console.log(token)
            console.log("JWT_KEY during verify:", process.env.JWT_KEY);
            const decoder=jwt.verify(token,process.env.JWT_KEY);
            req.user=decoder;
             console.log("Decoded:", decoder);
            next();
    }
    catch(e){
        console.log("error",e);
        return res.status(401).send({"message":"unauthorized access"});
    }
}

module.exports=authMiddleware;