import * as S from '../services/patientData.service.js';

const pid = (req) => req.user.profileId;

// ─── Recovery Plan ────────────────────────────────────────────────────────────

export const getActivePlan = async (req, res, next) => {
    try {
        const data = await S.getActivePlan(pid(req));
        if (!data) return res.sendStructuredResponse(404, 'No active recovery plan found', null);
        return res.sendStructuredResponse(200, 'Active recovery plan fetched', data);
    } catch (err) { next(err); }
};

export const getPlanProgress = async (req, res, next) => {
    try {
        const data = await S.getPlanProgress(pid(req));
        if (!data) return res.sendStructuredResponse(404, 'No active recovery plan found', null);
        return res.sendStructuredResponse(200, 'Recovery plan progress fetched', data);
    } catch (err) { next(err); }
};

export const getPlanById = async (req, res, next) => {
    try {
        const data = await S.getPlanById(pid(req), req.params.planId);
        if (!data) return res.sendStructuredResponse(404, 'Recovery plan not found', null);
        return res.sendStructuredResponse(200, 'Recovery plan fetched', data);
    } catch (err) { next(err); }
};

// ─── Calendar ─────────────────────────────────────────────────────────────────

export const getCalendarToday = async (req, res, next) => {
    try {
        const data = await S.getCalendarToday(pid(req));
        if (!data) return res.sendStructuredResponse(404, 'No active recovery plan found', null);
        return res.sendStructuredResponse(200, "Today's calendar fetched", data);
    } catch (err) { next(err); }
};

export const getCalendarByDate = async (req, res, next) => {
    try {
        const data = await S.getCalendarByDate(pid(req), req.params.date);
        if (!data) return res.sendStructuredResponse(404, 'No active recovery plan found', null);
        return res.sendStructuredResponse(200, `Calendar for ${req.params.date} fetched`, data);
    } catch (err) { next(err); }
};

export const getCalendarRange = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        if (!from || !to) return res.sendStructuredResponse(400, 'from and to query params are required', null);
        const data = await S.getCalendarRange(pid(req), from, to);
        if (!data) return res.sendStructuredResponse(404, 'No active recovery plan found', null);
        return res.sendStructuredResponse(200, 'Calendar range fetched', data);
    } catch (err) { next(err); }
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const getTaskById = async (req, res, next) => {
    try {
        const data = await S.getTaskById(pid(req), req.params.taskId);
        if (!data) return res.sendStructuredResponse(404, 'Task not found', null);
        return res.sendStructuredResponse(200, 'Task fetched', data);
    } catch (err) { next(err); }
};

export const completeTask = async (req, res, next) => {
    try {
        const data = await S.completeTask(pid(req), req.params.taskId, req.body);
        if (!data) return res.sendStructuredResponse(404, 'Task not found or does not belong to your plan', null);
        return res.sendStructuredResponse(200, 'Task marked as completed', data);
    } catch (err) { next(err); }
};

export const updateCompletion = async (req, res, next) => {
    try {
        const data = await S.updateCompletion(pid(req), req.params.completionId, req.body);
        if (!data) return res.sendStructuredResponse(404, 'Completion record not found', null);
        return res.sendStructuredResponse(200, 'Completion updated', data);
    } catch (err) { next(err); }
};

export const getCompletionHistory = async (req, res, next) => {
    try {
        const data = await S.getCompletionHistory(pid(req));
        return res.sendStructuredResponse(200, 'Completion history fetched', data);
    } catch (err) { next(err); }
};

export const createTask = async (req, res, next) => {
    try {
        const data = await S.createPatientTask(pid(req), req.body);
        if (!data) return res.sendStructuredResponse(404, 'No active recovery plan to add task to', null);
        return res.sendStructuredResponse(201, 'Task created', data);
    } catch (err) { next(err); }
};

// ─── Daily Reviews ────────────────────────────────────────────────────────────

export const submitDailyReview = async (req, res, next) => {
    try {
        const data = await S.submitDailyReview(pid(req), req.body);
        return res.sendStructuredResponse(201, 'Daily review submitted', data);
    } catch (err) { next(err); }
};

export const getDailyReviews = async (req, res, next) => {
    try {
        const data = await S.getDailyReviews(pid(req));
        return res.sendStructuredResponse(200, 'Daily reviews fetched', data);
    } catch (err) { next(err); }
};

export const getTodayReview = async (req, res, next) => {
    try {
        const data = await S.getTodayReview(pid(req));
        if (!data) return res.sendStructuredResponse(404, 'No review submitted for today', null);
        return res.sendStructuredResponse(200, "Today's review fetched", data);
    } catch (err) { next(err); }
};

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const getAlerts = async (req, res, next) => {
    try {
        const data = await S.getAlerts(pid(req));
        return res.sendStructuredResponse(200, 'Alerts fetched', data);
    } catch (err) { next(err); }
};

export const getUnreadAlerts = async (req, res, next) => {
    try {
        const data = await S.getUnreadAlerts(pid(req));
        return res.sendStructuredResponse(200, 'Unread alerts fetched', data);
    } catch (err) { next(err); }
};

export const markAlertRead = async (req, res, next) => {
    try {
        const data = await S.markAlertRead(pid(req), req.params.alertId);
        if (!data) return res.sendStructuredResponse(404, 'Alert not found', null);
        return res.sendStructuredResponse(200, 'Alert marked as read', data);
    } catch (err) { next(err); }
};

export const dismissAlert = async (req, res, next) => {
    try {
        const data = await S.dismissAlert(pid(req), req.params.alertId);
        if (!data) return res.sendStructuredResponse(404, 'Alert not found', null);
        return res.sendStructuredResponse(200, 'Alert dismissed', data);
    } catch (err) { next(err); }
};

export const createAlert = async (req, res, next) => {
    try {
        const { type, severity, title, message } = req.body;
        if (!type || !title || !message) {
            return res.sendStructuredResponse(400, 'type, title, and message are required', null);
        }
        const data = await S.createAlert(pid(req), { type, severity, title, message });
        return res.sendStructuredResponse(201, 'Alert created', data);
    } catch (err) { next(err); }
};

// ─── Reports ──────────────────────────────────────────────────────────────────

export const getReports = async (req, res, next) => {
    try {
        const data = await S.getReports(pid(req));
        return res.sendStructuredResponse(200, 'Reports fetched', data);
    } catch (err) { next(err); }
};

export const getReportById = async (req, res, next) => {
    try {
        const data = await S.getReportById(pid(req), req.params.reportId);
        if (!data) return res.sendStructuredResponse(404, 'Report not found', null);
        return res.sendStructuredResponse(200, 'Report fetched', data);
    } catch (err) { next(err); }
};

export const getExtractedData = async (req, res, next) => {
    try {
        const data = await S.getExtractedData(pid(req), req.params.reportId);
        if (!data) return res.sendStructuredResponse(404, 'Extracted data not found', null);
        return res.sendStructuredResponse(200, 'Extracted data fetched', data);
    } catch (err) { next(err); }
};

export const getPatientFile = async (req, res, next) => {
    try {
        const data = await S.getPatientFile(pid(req));
        if (!data) return res.sendStructuredResponse(404, 'Patient file not found', null);
        return res.sendStructuredResponse(200, 'Patient file fetched', data);
    } catch (err) { next(err); }
};
