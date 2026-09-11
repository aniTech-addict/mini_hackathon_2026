import { Router } from 'express';
import { getMyProfile, updateMyProfile, getMyDoctor } from '../controllers/patient.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = Router();

router.use(verifyToken, requireRole('patient'));

router.get('/me', getMyProfile);
router.patch('/me', updateMyProfile);
router.get('/me/doctor', getMyDoctor);

export default router;
