import db from '../db/db.js';
import { processReportFile } from './ocr.service.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const verifyPatientBelongsToDoctor = async (doctorId, patientId) => {
    const res = await db.query(
        'SELECT patient_id FROM patients WHERE patient_id = $1 AND doctor_id = $2',
        [patientId, doctorId]
    );
    return res.rows.length > 0;
};

// ─── 3.1 Patient Management ───────────────────────────────────────────────────

export const getPatients = async (doctorId) => {
    const res = await db.query(
        `SELECT p.patient_id, p.age, p.sex, p.address, p.email, p.phone_number,
                p.created_at, p.updated_at,
                u.user_id AS username, u.phone_number AS user_phone
         FROM patients p
         JOIN users u ON u.id = p.user_id
         WHERE p.doctor_id = $1
         ORDER BY p.created_at DESC`,
        [doctorId]
    );
    return res.rows;
};

export const getPatientById = async (doctorId, patientId) => {
    const res = await db.query(
        `SELECT p.*, u.user_id AS username, u.phone_number AS user_phone, u.created_at AS user_created_at
         FROM patients p
         JOIN users u ON u.id = p.user_id
         WHERE p.patient_id = $1 AND p.doctor_id = $2`,
        [patientId, doctorId]
    );
    return res.rows[0] || null;
};

export const getPatientFile = async (doctorId, patientId) => {
    const belongs = await verifyPatientBelongsToDoctor(doctorId, patientId);
    if (!belongs) return null;

    const res = await db.query(
        'SELECT * FROM patient_files WHERE patient_id = $1',
        [patientId]
    );
    return res.rows[0] || null;
};

// ─── 3.2 Medical Report Upload ────────────────────────────────────────────────

export const uploadReport = async (doctorId, patientId, file, reportType, userId) => {
    const belongs = await verifyPatientBelongsToDoctor(doctorId, patientId);
    if (!belongs) return null;

    // Store file as base64 data URI for MVP — swap to S3/cloud storage URL in production
    const fileBase64 = file.buffer.toString('base64');
    const fileUrl = `data:${file.mimetype};base64,${fileBase64}`;

    const res = await db.query(
        `INSERT INTO medical_reports
            (patient_id, uploaded_by_user_id, report_type, file_name, file_url, mime_type, ocr_status)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending')
         RETURNING report_id, patient_id, report_type, file_name, mime_type, ocr_status, uploaded_at`,
        [patientId, userId, reportType || 'discharge_summary', file.originalname, fileUrl, file.mimetype]
    );
    return res.rows[0];
};

export const getPatientReports = async (doctorId, patientId) => {
    const belongs = await verifyPatientBelongsToDoctor(doctorId, patientId);
    if (!belongs) return null;

    const res = await db.query(
        `SELECT report_id, patient_id, uploaded_by_user_id, report_type, file_name,
                mime_type, ocr_status, uploaded_at, processed_at
         FROM medical_reports
         WHERE patient_id = $1
         ORDER BY uploaded_at DESC`,
        [patientId]
    );
    return res.rows;
};

export const getReportById = async (doctorId, reportId) => {
    const res = await db.query(
        `SELECT mr.report_id, mr.patient_id, mr.report_type, mr.file_name,
                mr.mime_type, mr.ocr_status, mr.uploaded_at, mr.processed_at
         FROM medical_reports mr
         JOIN patients p ON p.patient_id = mr.patient_id
         WHERE mr.report_id = $1 AND p.doctor_id = $2`,
        [reportId, doctorId]
    );
    return res.rows[0] || null;
};

export const getReportStatus = async (doctorId, reportId) => {
    const res = await db.query(
        `SELECT mr.report_id, mr.ocr_status, mr.processed_at
         FROM medical_reports mr
         JOIN patients p ON p.patient_id = mr.patient_id
         WHERE mr.report_id = $1 AND p.doctor_id = $2`,
        [reportId, doctorId]
    );
    return res.rows[0] || null;
};

// ─── 3.4 Recovery Plan Generation ────────────────────────────────────────────

export const generateRecoveryPlan = async (doctorId, patientId, reportId) => {
    const belongs = await verifyPatientBelongsToDoctor(doctorId, patientId);
    if (!belongs) return null;

    // If a reportId is provided, verify it belongs to this patient
    if (reportId) {
        const reportCheck = await db.query(
            'SELECT report_id FROM medical_reports WHERE report_id = $1 AND patient_id = $2',
            [reportId, patientId]
        );
        if (!reportCheck.rows[0]) return { error: 'report_not_found' };
    }

    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    const endDateStr = endDate.toISOString().split('T')[0];

    // Create draft plan
    const planRes = await db.query(
        `INSERT INTO recovery_plans (patient_id, doctor_id, title, start_date, end_date, status)
         VALUES ($1, $2, $3, $4, $5, 'draft')
         RETURNING *`,
        [patientId, doctorId, 'AI-Generated Recovery Plan (Draft)', today, endDateStr]
    );
    const plan = planRes.rows[0];

    // Insert placeholder tasks (real AI output replaces these)
    const placeholderTasks = [
        { title: 'Take prescribed medication', category: 'MEDICATION', start_day: 1, end_day: 7, times: ['08:00', '20:00'] },
        { title: 'Wound check and care', category: 'WOUND_CARE', start_day: 1, end_day: 14, times: ['18:00'] },
        { title: 'Walking exercise', category: 'EXERCISE', start_day: 3, end_day: 30, times: ['11:00'] },
    ];

    const insertedTasks = [];
    for (const t of placeholderTasks) {
        const taskRes = await db.query(
            `INSERT INTO recovery_tasks
                (recovery_plan_id, title, category, start_day, end_day, schedule_times, frequency, is_required)
             VALUES ($1, $2, $3, $4, $5, $6, 'DAILY', true)
             RETURNING *`,
            [plan.id, t.title, t.category, t.start_day, t.end_day, t.times]
        );
        insertedTasks.push(taskRes.rows[0]);
    }

    return { ...plan, tasks: insertedTasks };
};

export const getPatientRecoveryPlans = async (doctorId, patientId) => {
    const belongs = await verifyPatientBelongsToDoctor(doctorId, patientId);
    if (!belongs) return null;

    const res = await db.query(
        `SELECT * FROM recovery_plans WHERE patient_id = $1 ORDER BY created_at DESC`,
        [patientId]
    );
    return res.rows;
};

export const getRecoveryPlanById = async (doctorId, planId) => {
    const res = await db.query(
        `SELECT rp.*
         FROM recovery_plans rp
         JOIN patients p ON p.patient_id = rp.patient_id
         WHERE rp.id = $1 AND p.doctor_id = $2`,
        [planId, doctorId]
    );
    const plan = res.rows[0];
    if (!plan) return null;

    const tasksRes = await db.query(
        'SELECT * FROM recovery_tasks WHERE recovery_plan_id = $1 ORDER BY start_day',
        [planId]
    );
    return { ...plan, tasks: tasksRes.rows };
};

export const updateRecoveryPlan = async (doctorId, planId, fields) => {
    // Only allow editing DRAFT plans
    const check = await db.query(
        `SELECT rp.id FROM recovery_plans rp
         JOIN patients p ON p.patient_id = rp.patient_id
         WHERE rp.id = $1 AND p.doctor_id = $2 AND rp.status = 'draft'`,
        [planId, doctorId]
    );
    if (!check.rows[0]) return null;

    const { title, start_date, end_date } = fields;
    const res = await db.query(
        `UPDATE recovery_plans
         SET title = COALESCE($1, title),
             start_date = COALESCE($2, start_date),
             end_date = COALESCE($3, end_date),
             updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [title, start_date, end_date, planId]
    );
    return res.rows[0];
};

export const approvePlan = async (doctorId, planId) => {
    const check = await db.query(
        `SELECT rp.id FROM recovery_plans rp
         JOIN patients p ON p.patient_id = rp.patient_id
         WHERE rp.id = $1 AND p.doctor_id = $2 AND rp.status = 'draft'`,
        [planId, doctorId]
    );
    if (!check.rows[0]) return null;

    const res = await db.query(
        `UPDATE recovery_plans
         SET status = 'active', updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [planId]
    );
    return res.rows[0];
};

export const cancelPlan = async (doctorId, planId) => {
    const check = await db.query(
        `SELECT rp.id FROM recovery_plans rp
         JOIN patients p ON p.patient_id = rp.patient_id
         WHERE rp.id = $1 AND p.doctor_id = $2
           AND rp.status NOT IN ('cancelled', 'completed')`,
        [planId, doctorId]
    );
    if (!check.rows[0]) return null;

    const res = await db.query(
        `UPDATE recovery_plans
         SET status = 'cancelled', updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [planId]
    );
    return res.rows[0];
};

// ─── 3.5 Recovery Tasks ───────────────────────────────────────────────────────

export const createTask = async (doctorId, planId, taskData) => {
    // Verify plan belongs to doctor
    const check = await db.query(
        `SELECT rp.id FROM recovery_plans rp
         JOIN patients p ON p.patient_id = rp.patient_id
         WHERE rp.id = $1 AND p.doctor_id = $2`,
        [planId, doctorId]
    );
    if (!check.rows[0]) return null;

    const { title, description, category, start_day, end_day, schedule_times, duration_minutes, frequency, is_required } = taskData;
    const res = await db.query(
        `INSERT INTO recovery_tasks
            (recovery_plan_id, title, description, category, start_day, end_day, schedule_times, duration_minutes, frequency, is_required)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [planId, title, description || null, category || null, start_day || 1, end_day || null, schedule_times || [], duration_minutes || null, frequency || null, is_required ?? false]
    );
    return res.rows[0];
};

export const getPlanTasks = async (doctorId, planId) => {
    const check = await db.query(
        `SELECT rp.id FROM recovery_plans rp
         JOIN patients p ON p.patient_id = rp.patient_id
         WHERE rp.id = $1 AND p.doctor_id = $2`,
        [planId, doctorId]
    );
    if (!check.rows[0]) return null;

    const res = await db.query(
        'SELECT * FROM recovery_tasks WHERE recovery_plan_id = $1 ORDER BY start_day',
        [planId]
    );
    return res.rows;
};

export const getTaskById = async (doctorId, taskId) => {
    const res = await db.query(
        `SELECT rt.*
         FROM recovery_tasks rt
         JOIN recovery_plans rp ON rp.id = rt.recovery_plan_id
         JOIN patients p ON p.patient_id = rp.patient_id
         WHERE rt.task_id = $1 AND p.doctor_id = $2`,
        [taskId, doctorId]
    );
    return res.rows[0] || null;
};

export const updateTask = async (doctorId, taskId, fields) => {
    const task = await getTaskById(doctorId, taskId);
    if (!task) return null;

    const { title, description, category, start_day, end_day, schedule_times, duration_minutes, frequency, is_required } = fields;
    const res = await db.query(
        `UPDATE recovery_tasks
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             category = COALESCE($3, category),
             start_day = COALESCE($4, start_day),
             end_day = COALESCE($5, end_day),
             schedule_times = COALESCE($6, schedule_times),
             duration_minutes = COALESCE($7, duration_minutes),
             frequency = COALESCE($8, frequency),
             is_required = COALESCE($9, is_required),
             updated_at = NOW()
         WHERE task_id = $10
         RETURNING *`,
        [title, description, category, start_day, end_day, schedule_times, duration_minutes, frequency, is_required, taskId]
    );
    return res.rows[0];
};

export const deleteTask = async (doctorId, taskId) => {
    const task = await getTaskById(doctorId, taskId);
    if (!task) return null;

    await db.query('DELETE FROM recovery_tasks WHERE task_id = $1', [taskId]);
    return { deleted: true, task_id: taskId };
};

// ─── 3.6 Adherence & Daily Reviews ───────────────────────────────────────────

export const getPatientTaskCompletions = async (doctorId, patientId) => {
    const belongs = await verifyPatientBelongsToDoctor(doctorId, patientId);
    if (!belongs) return null;

    const res = await db.query(
        `SELECT tc.*, rt.title AS task_title, rt.category
         FROM task_completions tc
         JOIN recovery_tasks rt ON rt.task_id = tc.task_id
         WHERE tc.patient_id = $1
         ORDER BY tc.schedule_date DESC`,
        [patientId]
    );
    return res.rows;
};

export const getPatientAdherence = async (doctorId, patientId) => {
    const belongs = await verifyPatientBelongsToDoctor(doctorId, patientId);
    if (!belongs) return null;

    const totalRes = await db.query(
        `SELECT COUNT(*) AS total FROM task_completions WHERE patient_id = $1`,
        [patientId]
    );
    const completedRes = await db.query(
        `SELECT COUNT(*) AS completed FROM task_completions WHERE patient_id = $1 AND status = 'completed'`,
        [patientId]
    );
    const missedRes = await db.query(
        `SELECT COUNT(*) AS missed FROM task_completions WHERE patient_id = $1 AND status = 'missed'`,
        [patientId]
    );

    const total = parseInt(totalRes.rows[0].total);
    const completed = parseInt(completedRes.rows[0].completed);
    const missed = parseInt(missedRes.rows[0].missed);
    const adherenceRate = total > 0 ? ((completed / total) * 100).toFixed(1) : null;

    return { patient_id: patientId, total_tasks: total, completed, missed, pending: total - completed - missed, adherence_rate: adherenceRate ? `${adherenceRate}%` : null };
};

export const getPatientDailyReviews = async (doctorId, patientId) => {
    const belongs = await verifyPatientBelongsToDoctor(doctorId, patientId);
    if (!belongs) return null;

    const res = await db.query(
        'SELECT * FROM daily_reviews WHERE patient_id = $1 ORDER BY review_date DESC',
        [patientId]
    );
    return res.rows;
};

export const getLatestDailyReview = async (doctorId, patientId) => {
    const belongs = await verifyPatientBelongsToDoctor(doctorId, patientId);
    if (!belongs) return null;

    const res = await db.query(
        'SELECT * FROM daily_reviews WHERE patient_id = $1 ORDER BY review_date DESC LIMIT 1',
        [patientId]
    );
    return res.rows[0] || null;
};

// ─── 3.7 Doctor Alerts ────────────────────────────────────────────────────────

export const getDoctorAlerts = async (doctorId) => {
    const res = await db.query(
        `SELECT a.* FROM alerts a
         JOIN patients p ON p.patient_id = a.patient_id
         WHERE p.doctor_id = $1
         ORDER BY a.triggered_at DESC`,
        [doctorId]
    );
    return res.rows;
};

export const getUnreadDoctorAlerts = async (doctorId) => {
    const res = await db.query(
        `SELECT a.* FROM alerts a
         JOIN patients p ON p.patient_id = a.patient_id
         WHERE p.doctor_id = $1 AND a.status = 'unread'
         ORDER BY a.triggered_at DESC`,
        [doctorId]
    );
    return res.rows;
};

export const markDoctorAlertRead = async (doctorId, alertId) => {
    // Verify the alert belongs to one of this doctor's patients
    const check = await db.query(
        `SELECT a.id FROM alerts a
         JOIN patients p ON p.patient_id = a.patient_id
         WHERE a.id = $1 AND p.doctor_id = $2`,
        [alertId, doctorId]
    );
    if (!check.rows[0]) return null;

    const res = await db.query(
        `UPDATE alerts SET status = 'read', read_at = NOW() WHERE id = $1 RETURNING *`,
        [alertId]
    );
    return res.rows[0];
};

export const resolveDoctorAlert = async (doctorId, alertId) => {
    const check = await db.query(
        `SELECT a.id FROM alerts a
         JOIN patients p ON p.patient_id = a.patient_id
         WHERE a.id = $1 AND p.doctor_id = $2`,
        [alertId, doctorId]
    );
    if (!check.rows[0]) return null;

    const res = await db.query(
        `UPDATE alerts SET status = 'resolved', resolved_at = NOW() WHERE id = $1 RETURNING *`,
        [alertId]
    );
    return res.rows[0];
};

// ─── 3.3 OCR & AI Processing ─────────────────────────────────────────────────

export const processReport = async (doctorId, reportId) => {
    // Verify report belongs to doctor's patient
    const reportRes = await db.query(
        `SELECT mr.* FROM medical_reports mr
         JOIN patients p ON p.patient_id = mr.patient_id
         WHERE mr.report_id = $1 AND p.doctor_id = $2`,
        [reportId, doctorId]
    );
    const report = reportRes.rows[0];
    if (!report) return null;

    // Set status to processing
    await db.query(
        `UPDATE medical_reports SET ocr_status = 'processing' WHERE report_id = $1`,
        [reportId]
    );

    try {
        // Run OCR + AI pipeline
        const { raw_text, structured } = await processReportFile(report.file_url, report.mime_type);

        // Upsert extracted data
        await db.query(
            `INSERT INTO report_extracted_data (report_id, extracted_data, parser_version)
             VALUES ($1, $2, $3)
             ON CONFLICT (report_id)
             DO UPDATE SET extracted_data = EXCLUDED.extracted_data, updated_at = NOW()`,
            [reportId, JSON.stringify(structured), 'tesseract+llama-3.3-70b-v1']
        );

        // Update report: store ocr_text + mark completed
        await db.query(
            `UPDATE medical_reports
             SET ocr_status = 'completed', ocr_text = $1, processed_at = NOW()
             WHERE report_id = $2`,
            [raw_text, reportId]
        );

        return { report_id: reportId, ocr_status: 'completed', extracted_data: structured };
    } catch (err) {
        // Mark as failed on error
        await db.query(
            `UPDATE medical_reports SET ocr_status = 'failed' WHERE report_id = $1`,
            [reportId]
        );
        throw err;
    }
};

export const getExtractedData = async (doctorId, reportId) => {
    // Verify ownership
    const check = await db.query(
        `SELECT mr.report_id FROM medical_reports mr
         JOIN patients p ON p.patient_id = mr.patient_id
         WHERE mr.report_id = $1 AND p.doctor_id = $2`,
        [reportId, doctorId]
    );
    if (!check.rows[0]) return null;

    const res = await db.query(
        'SELECT * FROM report_extracted_data WHERE report_id = $1',
        [reportId]
    );
    return res.rows[0] || null;
};

export const updateExtractedData = async (doctorId, reportId, extractedData) => {
    // Verify ownership
    const check = await db.query(
        `SELECT mr.report_id FROM medical_reports mr
         JOIN patients p ON p.patient_id = mr.patient_id
         WHERE mr.report_id = $1 AND p.doctor_id = $2`,
        [reportId, doctorId]
    );
    if (!check.rows[0]) return null;

    const res = await db.query(
        `UPDATE report_extracted_data
         SET extracted_data = $1, updated_at = NOW()
         WHERE report_id = $2
         RETURNING *`,
        [JSON.stringify(extractedData), reportId]
    );
    return res.rows[0] || null;
};
