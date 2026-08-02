
require('dotenv').config(); 

const prisma = require('./config/prisma');

const app = require('./app'); 

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log("Database connected");

        // Cast to a Number to prevent unpredictable Express port behavior
        const port = Number(process.env.PORT); 

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });

    } catch (e) {
        console.log("Initialization Error:", e);
        process.exit(1); 
    }
}

startServer();
