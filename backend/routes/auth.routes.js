import { Router } from 'express';
import { register, login, getMe, refresh, logout } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.post('/refresh', verifyToken, refresh);
router.post('/logout', verifyToken, logout);

export default router;
