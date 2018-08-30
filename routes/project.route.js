
import express from 'express';
import projectController from "../controllers/project.controller";
import passportManager from '../config/passport';
const router = express.Router();
router.route('/')
.get(passportManager.authenticate, projectController.get)
.post(passportManager.authenticate, projectController.add);

export default router;