const express=require("express");
const authRoutes=require('./routes/authRoutes');
const organizationRoutes=require('./routes/organizationRoutes');


const app=express();

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/org', organizationRoutes);

module.exports=app;
