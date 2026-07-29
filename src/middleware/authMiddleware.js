

const authMiddleware=async(req,res,next)=>{
  const authHeader=req.headers.authorization;

  if(!authHeader.startWith("Bearer ")){
    return res.status(401).send({"message":"no authentication token"})
  }

  const token=authHeader.split(" ")[1];

    try{
            if(!token){
                return res.status(401).send({"message":"no authentication token"});
            }

            const decoder=jwt.verify(token,process.env.JWT_KEY);
            req.user=decoder;
            next();
    }
    catch(e){
        console.log("error",e);
        return res.status(401).send({"message":"unauthorized access"});
    }
}
