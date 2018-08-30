
import Project from "../models/project.model";
class ProjectController{
  async add(req, res) {    
        if (req.user && req.user.username) {          
            const newProject = new Project({
                title: req.body.title,
                summary: req.body.summary,
                description: req.body.description,
                submitDate: req.body.submitDate,
                submittedBy: req.user.username
            });
            try{ 
                let result = await newProject.save();
                res.json({success: true, msg: 'New project is created successfully.'});
            }
            catch(err){
                return res.json({success: false, msg: 'Save project failed.'});
            }
        } else {
          return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
      }

async get(req, res) { 
        if (req.user && req.user.username) {
            try{
                let projects = await Project.find({submittedBy: req.user.username}).lean().exec();
                return res.json(projects);    
            }
            catch(err){
                return next(err);
            }
        } else {
          return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
      }
}

export default new ProjectController();