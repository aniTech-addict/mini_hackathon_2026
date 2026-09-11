import db from '../db/db.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getDateStr = (date = new Date()) => date.toISOString().split('T')[0];

const daysBetween = (dateA, dateB) =>
    Math.floor((new Date(dateA) - new Date(dateB)) / 86_400_000);

const getActivePlanForPatient = async (patientId) => {
    const res = await db.query(
        `SELECT * FROM recovery_plans
         WHERE patient_id = $1 AND status = 'active'
         ORDER BY created_at DESC LIMIT 1`,
        [patientId]
    );
    return res.rows[0] || null;
};

const buildCalendarDay = async (patientId, plan, dateStr) => {
    const recoveryDay = daysBetween(dateStr, plan.start_date) + 1;

    if (recoveryDay < 1) return { date: dateStr, recovery_day: recoveryDay, tasks: [] };

    const tasksRes = await db.query(
        `SELECT * FROM recovery_tasks
         WHERE recovery_plan_id = $1
           AND start_day <= $2
           AND (end_day IS NULL OR end_day >= $2)`,
        [plan.id, recoveryDay]
    );

    const completionsRes = await db.query(
        `SELECT * FROM task_completions
         WHERE patient_id = $1 AND schedule_date = $2`,
        [patientId, dateStr]
    );

    const completionMap = {};
    for (const c of completionsRes.rows) {
        completionMap[c.task_id] = c;
    }

    const tasks = tasksRes.rows.map((t) => ({
        ...t,
        completion: completionMap[t.task_id] || null,
        status: completionMap[t.task_id]?.status || 'pending',
    }));

    return {
        date: dateStr,
        recovery_day: recoveryDay,
        plan_id: plan.id,
        plan_status: plan.status,
        tasks,
    };
};

// ─── Recovery Plan ────────────────────────────────────────────────────────────

export const getActivePlan = async (patientId) => {
    const plan = await getActivePlanForPatient(patientId);
    if (!plan) return null;

    const tasksRes = await db.query(
        'SELECT * FROM recovery_tasks WHERE recovery_plan_id = $1 ORDER BY start_day',
        [plan.id]
    );

    return { ...plan, tasks: tasksRes.rows };
};

export const getPlanProgress = async (patientId) => {
    const plan = await getActivePlanForPatient(patientId);
    if (!plan) return null;

    const today = getDateStr();
    const recoveryDay = daysBetween(today, plan.start_date) + 1;

    const totalTasksRes = await db.query(
        'SELECT COUNT(*) AS count FROM recovery_tasks WHERE recovery_plan_id = $1',
        [plan.id]
    );

    const completedRes = await db.query(
        `SELECT COUNT(*) AS count FROM task_completions
         WHERE patient_id = $1 AND status = 'completed'`,
        [patientId]
    );

    const totalDays = plan.end_date ? daysBetween(plan.end_date, plan.start_date) + 1 : null;

    return {
        plan_id: plan.id,
        title: plan.title,
        status: plan.status,
        start_date: plan.start_date,
        end_date: plan.end_date,
        recovery_day: recoveryDay,
        total_days: totalDays,
        total_tasks: parseInt(totalTasksRes.rows[0].count),
        completed_tasks: parseInt(completedRes.rows[0].count),
    };
};

export const getPlanById = async (patientId, planId) => {
    const planRes = await db.query(
        'SELECT * FROM recovery_plans WHERE id = $1 AND patient_id = $2',
        [planId, patientId]
    );

    const plan = planRes.rows[0];
    if (!plan) return null;

    const tasksRes = await db.query(
        'SELECT * FROM recovery_tasks WHERE recovery_plan_id = $1 ORDER BY start_day',
        [plan.id]
    );

    return { ...plan, tasks: tasksRes.rows };
};

// ─── Calendar ─────────────────────────────────────────────────────────────────

export const getCalendarToday = async (patientId) => {
    const plan = await getActivePlanForPatient(patientId);
    if (!plan) return null;
    return buildCalendarDay(patientId, plan, getDateStr());
};

export const getCalendarByDate = async (patientId, dateStr) => {
    const plan = await getActivePlanForPatient(patientId);
    if (!plan) return null;
    return buildCalendarDay(patientId, plan, dateStr);
};

export const getCalendarRange = async (patientId, from, to) => {
    const plan = await getActivePlanForPatient(patientId);
    if (!plan) return null;

    const days = [];
    const current = new Date(from);
    const end = new Date(to);

    while (current <= end) {
        const dateStr = getDateStr(current);
        days.push(await buildCalendarDay(patientId, plan, dateStr));
        current.setDate(current.getDate() + 1);
    }

    return days;
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const getTaskById = async (patientId, taskId) => {
    const res = await db.query(
        `SELECT rt.* FROM recovery_tasks rt
         JOIN recovery_plans rp ON rp.id = rt.recovery_plan_id
         WHERE rt.task_id = $1 AND rp.patient_id = $2`,
        [taskId, patientId]
    );
    return res.rows[0] || null;
};

export const completeTask = async (patientId, taskId, { schedule_date, schedule_time, notes }) => {
    // Verify task belongs to this patient's plan
    const task = await getTaskById(patientId, taskId);
    if (!task) return null;

    const res = await db.query(
        `INSERT INTO task_completions (task_id, patient_id, schedule_date, schedule_time, notes, status, completed_at)
         VALUES ($1, $2, $3, $4, $5, 'completed', NOW())
         ON CONFLICT (task_id, patient_id, schedule_date, schedule_time)
         DO UPDATE SET status = 'completed', notes = EXCLUDED.notes, completed_at = NOW(), updated_at = NOW()
         RETURNING *`,
        [taskId, patientId, schedule_date, schedule_time || null, notes || null]
    );
    return res.rows[0];
};

export const updateCompletion = async (patientId, completionId, { status, notes }) => {
    const res = await db.query(
        `UPDATE task_completions
         SET status = COALESCE($1, status),
             notes = COALESCE($2, notes),
             completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE completed_at END,
             updated_at = NOW()
         WHERE id = $3 AND patient_id = $4
         RETURNING *`,
        [status || null, notes || null, completionId, patientId]
    );
    return res.rows[0] || null;
};

export const getCompletionHistory = async (patientId) => {
    const res = await db.query(
        `SELECT tc.*, rt.title AS task_title, rt.category
         FROM task_completions tc
         JOIN recovery_tasks rt ON rt.task_id = tc.task_id
         WHERE tc.patient_id = $1
         ORDER BY tc.schedule_date DESC, tc.schedule_time DESC`,
        [patientId]
    );
    return res.rows;
};

export const createPatientTask = async (patientId, taskData) => {
    const plan = await getActivePlanForPatient(patientId);
    if (!plan) return null;

    const { title, description, category, start_day, end_day, schedule_times, duration_minutes, frequency, is_required } = taskData;

    const res = await db.query(
        `INSERT INTO recovery_tasks
            (recovery_plan_id, title, description, category, start_day, end_day, schedule_times, duration_minutes, frequency, is_required)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
            plan.id,
            title,
            description || null,
            category || null,
            start_day || 1,
            end_day || null,
            schedule_times || [],
            duration_minutes || null,
            frequency || null,
            is_required ?? false,
        ]
    );
    return res.rows[0];
};

// ─── Daily Reviews ────────────────────────────────────────────────────────────

export const submitDailyReview = async (patientId, { recovery_plan_id, review_date, scale, note }) => {
    const res = await db.query(
        `INSERT INTO daily_reviews (patient_id, recovery_plan_id, review_date, scale, note)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (patient_id, recovery_plan_id, review_date)
         DO UPDATE SET scale = EXCLUDED.scale, note = EXCLUDED.note, updated_at = NOW()
         RETURNING *`,
        [patientId, recovery_plan_id, review_date, scale ?? null, note || null]
    );
    return res.rows[0];
};

export const getDailyReviews = async (patientId) => {
    const res = await db.query(
        'SELECT * FROM daily_reviews WHERE patient_id = $1 ORDER BY review_date DESC',
        [patientId]
    );
    return res.rows;
};

export const getTodayReview = async (patientId) => {
    const res = await db.query(
        'SELECT * FROM daily_reviews WHERE patient_id = $1 AND review_date = CURRENT_DATE',
        [patientId]
    );
    return res.rows[0] || null;
};

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const getAlerts = async (patientId) => {
    const res = await db.query(
        'SELECT * FROM alerts WHERE patient_id = $1 ORDER BY triggered_at DESC',
        [patientId]
    );
    return res.rows;
};

export const getUnreadAlerts = async (patientId) => {
    const res = await db.query(
        `SELECT * FROM alerts WHERE patient_id = $1 AND status = 'unread' ORDER BY triggered_at DESC`,
        [patientId]
    );
    return res.rows;
};

export const markAlertRead = async (patientId, alertId) => {
    const res = await db.query(
        `UPDATE alerts
         SET status = 'read', read_at = NOW()
         WHERE id = $1 AND patient_id = $2
         RETURNING *`,
        [alertId, patientId]
    );
    return res.rows[0] || null;
};

export const dismissAlert = async (patientId, alertId) => {
    const res = await db.query(
        `UPDATE alerts
         SET status = 'dismissed'
         WHERE id = $1 AND patient_id = $2
         RETURNING *`,
        [alertId, patientId]
    );
    return res.rows[0] || null;
};

export const createAlert = async (patientId, { type, severity, title, message }) => {
    // Auto-attach assigned doctor
    const patientRes = await db.query(
        'SELECT doctor_id FROM patients WHERE patient_id = $1',
        [patientId]
    );
    const doctor_id = patientRes.rows[0]?.doctor_id || null;

    const res = await db.query(
        `INSERT INTO alerts (patient_id, doctor_id, type, severity, title, message)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [patientId, doctor_id, type, severity || 'low', title, message]
    );
    return res.rows[0];
};

// ─── Reports ──────────────────────────────────────────────────────────────────

export const getReports = async (patientId) => {
    const res = await db.query(
        'SELECT * FROM medical_reports WHERE patient_id = $1 ORDER BY uploaded_at DESC',
        [patientId]
    );
    return res.rows;
};

export const getReportById = async (patientId, reportId) => {
    const res = await db.query(
        'SELECT * FROM medical_reports WHERE report_id = $1 AND patient_id = $2',
        [reportId, patientId]
    );
    return res.rows[0] || null;
};

export const getExtractedData = async (patientId, reportId) => {
    // Verify report belongs to patient first
    const reportRes = await db.query(
        'SELECT report_id FROM medical_reports WHERE report_id = $1 AND patient_id = $2',
        [reportId, patientId]
    );
    if (!reportRes.rows[0]) return null;

    const res = await db.query(
        'SELECT * FROM report_extracted_data WHERE report_id = $1',
        [reportId]
    );
    return res.rows[0] || null;
};

export const getPatientFile = async (patientId) => {
    const res = await db.query(
        'SELECT * FROM patient_files WHERE patient_id = $1',
        [patientId]
    );
    return res.rows[0] || null;
};
