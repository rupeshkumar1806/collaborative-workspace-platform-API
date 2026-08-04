const express=require("express");
const authRoutes=require('./routes/authRoutes');
const organizationRoutes=require('./routes/organizationRoutes');
const projectRoutes=require('./routes/projectRoutes');
const taskRoutes=require('./routes/taskRoutes');
const commentRoutes=require('./routes/commentRoutes');
const inviteRoutes=require('./routes/inviteRoutes');
const activityRoutes=require('./routes/activityRoutes');

const app=express();

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/org', organizationRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/activity', activityRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Collaborative Workspace Platform API",
    version: "1.0.0",
    status: "online",
    documentation: "Refer to the GitHub README for API endpoints."
  });
});
module.exports=app;
