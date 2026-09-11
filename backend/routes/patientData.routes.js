import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import {
    getActivePlan,
    getPlanProgress,
    getPlanById,
    getCalendarToday,
    getCalendarByDate,
    getCalendarRange,
    getTaskById,
    completeTask,
    updateCompletion,
    getCompletionHistory,
    createTask,
    submitDailyReview,
    getDailyReviews,
    getTodayReview,
    getAlerts,
    getUnreadAlerts,
    markAlertRead,
    dismissAlert,
    createAlert,
    getReports,
    getReportById,
    getExtractedData,
    getPatientFile,
} from '../controllers/patientData.controller.js';

const router = Router();

router.use(verifyToken, requireRole('patient'));

// Recovery Plan
router.get('/recovery-plan', getActivePlan);
router.get('/recovery-plan/progress', getPlanProgress);
router.get('/recovery-plan/:planId', getPlanById);

// Calendar
router.get('/calendar/today', getCalendarToday);
router.get('/calendar', getCalendarRange);
router.get('/calendar/:date', getCalendarByDate);

// Tasks
router.post('/tasks', createTask);
router.get('/tasks/:taskId', getTaskById);
router.post('/tasks/:taskId/complete', completeTask);
router.patch('/task-completions/:completionId', updateCompletion);
router.get('/task-completions', getCompletionHistory);

// Daily Reviews
router.post('/daily-reviews', submitDailyReview);
router.get('/daily-reviews/today', getTodayReview);
router.get('/daily-reviews', getDailyReviews);

// Alerts
router.post('/alerts', createAlert);
router.get('/alerts/unread', getUnreadAlerts);
router.get('/alerts', getAlerts);
router.patch('/alerts/:alertId/read', markAlertRead);
router.patch('/alerts/:alertId/dismiss', dismissAlert);

// Reports
router.get('/reports', getReports);
router.get('/reports/:reportId', getReportById);
router.get('/reports/:reportId/extracted-data', getExtractedData);

// Patient File
router.get('/file', getPatientFile);

export default router;
