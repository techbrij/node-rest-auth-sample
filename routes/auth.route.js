import authController from "../controllers/auth.controller";
import express from 'express';
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);

export default router;