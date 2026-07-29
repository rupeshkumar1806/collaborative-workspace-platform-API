const prisma=require('./config/prisma');
const app=require('./app');
require('dotenv').config();

const startServer=async()=>{

    try{
        await prisma.$connect();

        console.log("Database connected");

        app.listen(process.env.PORT,()=>{
            console.log("server is started");
        });

    }
    catch(e){
        console.log("error",e);
    }
}

startServer();