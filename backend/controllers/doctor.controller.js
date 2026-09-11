import * as DoctorService from '../services/doctor.service.js';

const did = (req) => req.user.profileId;

// ─── 3.1 Patient Management ───────────────────────────────────────────────────

export const getPatients = async (req, res, next) => {
    try {
        const data = await DoctorService.getPatients(did(req));
        return res.sendStructuredResponse(200, 'Patients fetched', data);
    } catch (err) {
        next(err);
    }
};

export const getPatientById = async (req, res, next) => {
    try {
        const data = await DoctorService.getPatientById(did(req), req.params.patientId);
        if (!data) return res.sendStructuredResponse(404, 'Patient not found or not assigned to you', null);
        return res.sendStructuredResponse(200, 'Patient fetched', data);
    } catch (err) {
        next(err);
    }
};

export const getPatientFile = async (req, res, next) => {
    try {
        const data = await DoctorService.getPatientFile(did(req), req.params.patientId);
        if (!data) return res.sendStructuredResponse(404, 'Patient file not found or access denied', null);
        return res.sendStructuredResponse(200, 'Patient file fetched', data);
    } catch (err) {
        next(err);
    }
};

// ─── 3.2 Medical Report Upload ────────────────────────────────────────────────

export const uploadReport = async (req, res, next) => {
    try {
        if (!req.file) return res.sendStructuredResponse(400, 'No file uploaded', null);
        const data = await DoctorService.uploadReport(
            did(req),
            req.params.patientId,
            req.file,
            req.body.report_type,
            req.user.id
        );
        if (!data) return res.sendStructuredResponse(403, 'Patient not assigned to you', null);
        return res.sendStructuredResponse(201, 'Report uploaded successfully', data);
    } catch (err) {
        next(err);
    }
};

export const getPatientReports = async (req, res, next) => {
    try {
        const data = await DoctorService.getPatientReports(did(req), req.params.patientId);
        if (!data) return res.sendStructuredResponse(403, 'Patient not assigned to you', null);
        return res.sendStructuredResponse(200, 'Patient reports fetched', data);
    } catch (err) {
        next(err);
    }
};

export const getReportById = async (req, res, next) => {
    try {
        const data = await DoctorService.getReportById(did(req), req.params.reportId);
        if (!data) return res.sendStructuredResponse(404, 'Report not found or access denied', null);
        return res.sendStructuredResponse(200, 'Report fetched', data);
    } catch (err) {
        next(err);
    }
};

export const getReportStatus = async (req, res, next) => {
    try {
        const data = await DoctorService.getReportStatus(did(req), req.params.reportId);
        if (!data) return res.sendStructuredResponse(404, 'Report not found or access denied', null);
        return res.sendStructuredResponse(200, 'Report status fetched', data);
    } catch (err) {
        next(err);
    }
};

// ─── 3.4 Recovery Plan Generation ────────────────────────────────────────────

export const generateRecoveryPlan = async (req, res, next) => {
    try {
        const result = await DoctorService.generateRecoveryPlan(did(req), req.params.patientId, req.body.report_id);
        if (!result) return res.sendStructuredResponse(403, 'Patient not assigned to you', null);
        if (result.error === 'report_not_found') return res.sendStructuredResponse(404, 'Report not found for this patient', null);
        return res.sendStructuredResponse(201, 'Recovery plan draft generated', result);
    } catch (err) {
        next(err);
    }
};

export const getPatientRecoveryPlans = async (req, res, next) => {
    try {
        const data = await DoctorService.getPatientRecoveryPlans(did(req), req.params.patientId);
        if (!data) return res.sendStructuredResponse(403, 'Patient not assigned to you', null);
        return res.sendStructuredResponse(200, 'Recovery plans fetched', data);
    } catch (err) {
        next(err);
    }
};

export const getRecoveryPlanById = async (req, res, next) => {
    try {
        const data = await DoctorService.getRecoveryPlanById(did(req), req.params.planId);
        if (!data) return res.sendStructuredResponse(404, 'Recovery plan not found or access denied', null);
        return res.sendStructuredResponse(200, 'Recovery plan fetched', data);
    } catch (err) {
        next(err);
    }
};

export const updateRecoveryPlan = async (req, res, next) => {
    try {
        const data = await DoctorService.updateRecoveryPlan(did(req), req.params.planId, req.body);
        if (!data) return res.sendStructuredResponse(404, 'Plan not found, not in draft status, or access denied', null);
        return res.sendStructuredResponse(200, 'Recovery plan updated', data);
    } catch (err) {
        next(err);
    }
};

export const approvePlan = async (req, res, next) => {
    try {
        const data = await DoctorService.approvePlan(did(req), req.params.planId);
        if (!data) return res.sendStructuredResponse(404, 'Plan not found, not in draft status, or access denied', null);
        return res.sendStructuredResponse(200, 'Recovery plan approved and is now active', data);
    } catch (err) {
        next(err);
    }
};

export const cancelPlan = async (req, res, next) => {
    try {
        const data = await DoctorService.cancelPlan(did(req), req.params.planId);
        if (!data) return res.sendStructuredResponse(404, 'Plan not found, already cancelled/completed, or access denied', null);
        return res.sendStructuredResponse(200, 'Recovery plan cancelled', data);
    } catch (err) {
        next(err);
    }
};

// ─── 3.5 Recovery Tasks ───────────────────────────────────────────────────────

export const createTask = async (req, res, next) => {
    try {
        const data = await DoctorService.createTask(did(req), req.params.planId, req.body);
        if (!data) return res.sendStructuredResponse(404, 'Plan not found or access denied', null);
        return res.sendStructuredResponse(201, 'Task created', data);
    } catch (err) { next(err); }
};

export const getPlanTasks = async (req, res, next) => {
    try {
        const data = await DoctorService.getPlanTasks(did(req), req.params.planId);
        if (!data) return res.sendStructuredResponse(404, 'Plan not found or access denied', null);
        return res.sendStructuredResponse(200, 'Plan tasks fetched', data);
    } catch (err) { next(err); }
};

export const getTaskById = async (req, res, next) => {
    try {
        const data = await DoctorService.getTaskById(did(req), req.params.taskId);
        if (!data) return res.sendStructuredResponse(404, 'Task not found or access denied', null);
        return res.sendStructuredResponse(200, 'Task fetched', data);
    } catch (err) { next(err); }
};

export const updateTask = async (req, res, next) => {
    try {
        const data = await DoctorService.updateTask(did(req), req.params.taskId, req.body);
        if (!data) return res.sendStructuredResponse(404, 'Task not found or access denied', null);
        return res.sendStructuredResponse(200, 'Task updated', data);
    } catch (err) { next(err); }
};

export const deleteTask = async (req, res, next) => {
    try {
        const data = await DoctorService.deleteTask(did(req), req.params.taskId);
        if (!data) return res.sendStructuredResponse(404, 'Task not found or access denied', null);
        return res.sendStructuredResponse(200, 'Task deleted', data);
    } catch (err) { next(err); }
};

// ─── 3.6 Adherence & Daily Reviews ───────────────────────────────────────────

export const getPatientTaskCompletions = async (req, res, next) => {
    try {
        const data = await DoctorService.getPatientTaskCompletions(did(req), req.params.patientId);
        if (!data) return res.sendStructuredResponse(403, 'Patient not assigned to you', null);
        return res.sendStructuredResponse(200, 'Task completions fetched', data);
    } catch (err) { next(err); }
};

export const getPatientAdherence = async (req, res, next) => {
    try {
        const data = await DoctorService.getPatientAdherence(did(req), req.params.patientId);
        if (!data) return res.sendStructuredResponse(403, 'Patient not assigned to you', null);
        return res.sendStructuredResponse(200, 'Patient adherence stats fetched', data);
    } catch (err) { next(err); }
};

export const getPatientDailyReviews = async (req, res, next) => {
    try {
        const data = await DoctorService.getPatientDailyReviews(did(req), req.params.patientId);
        if (!data) return res.sendStructuredResponse(403, 'Patient not assigned to you', null);
        return res.sendStructuredResponse(200, 'Patient daily reviews fetched', data);
    } catch (err) { next(err); }
};

export const getLatestDailyReview = async (req, res, next) => {
    try {
        const data = await DoctorService.getLatestDailyReview(did(req), req.params.patientId);
        if (!data) return res.sendStructuredResponse(404, 'No reviews found for this patient', null);
        return res.sendStructuredResponse(200, 'Latest daily review fetched', data);
    } catch (err) { next(err); }
};

// ─── 3.7 Doctor Alerts ────────────────────────────────────────────────────────

export const getDoctorAlerts = async (req, res, next) => {
    try {
        const data = await DoctorService.getDoctorAlerts(did(req));
        return res.sendStructuredResponse(200, 'Doctor alerts fetched', data);
    } catch (err) { next(err); }
};

export const getUnreadDoctorAlerts = async (req, res, next) => {
    try {
        const data = await DoctorService.getUnreadDoctorAlerts(did(req));
        return res.sendStructuredResponse(200, 'Unread doctor alerts fetched', data);
    } catch (err) { next(err); }
};

export const markDoctorAlertRead = async (req, res, next) => {
    try {
        const data = await DoctorService.markDoctorAlertRead(did(req), req.params.alertId);
        if (!data) return res.sendStructuredResponse(404, 'Alert not found or access denied', null);
        return res.sendStructuredResponse(200, 'Alert marked as read', data);
    } catch (err) { next(err); }
};

export const resolveDoctorAlert = async (req, res, next) => {
    try {
        const data = await DoctorService.resolveDoctorAlert(did(req), req.params.alertId);
        if (!data) return res.sendStructuredResponse(404, 'Alert not found or access denied', null);
        return res.sendStructuredResponse(200, 'Alert resolved', data);
    } catch (err) { next(err); }
};
