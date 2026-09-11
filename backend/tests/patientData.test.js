import { jest } from '@jest/globals';
import request from 'supertest';
import db from '../db/db.js';
import app from '../index.js';
import { createPatientToken, createDoctorToken } from './helpers/auth.helper.js';

describe('Patient Recovery & Data API Endpoints (/api/v1/patient)', () => {
    let patientToken;

    beforeEach(() => {
        patientToken = createPatientToken({ profileId: 'p-1' });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ─── Role / Auth check ───────────────────────────────────────────────────
    describe('Authentication & Role Check', () => {
        it('should return 401 if unauthenticated', async () => {
            const res = await request(app).get('/api/v1/patient/recovery-plan');
            expect(res.status).toBe(401);
        });

        it('should return 403 if user is a doctor', async () => {
            const docToken = createDoctorToken();
            const res = await request(app)
                .get('/api/v1/patient/recovery-plan')
                .set('Authorization', `Bearer ${docToken}`);
            expect(res.status).toBe(403);
        });
    });

    // ─── 2.2 Recovery Plan ───────────────────────────────────────────────────
    describe('Recovery Plan Endpoints', () => {
        it('GET /recovery-plan: should return 404 if no active plan', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .get('/api/v1/patient/recovery-plan')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/No active recovery plan found/i);
        });

        it('GET /recovery-plan: should return active plan with tasks', async () => {
            const mockPlan = { id: 'plan-1', patient_id: 'p-1', status: 'active', title: 'Knee Rehab' };
            const mockTasks = [{ id: 'task-1', title: 'Walk 10 mins' }];

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [mockPlan] }) // plan query
                .mockResolvedValueOnce({ rows: mockTasks }); // tasks query

            const res = await request(app)
                .get('/api/v1/patient/recovery-plan')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.id).toBe('plan-1');
            expect(res.body.data.tasks).toHaveLength(1);
        });

        it('GET /recovery-plan/progress: should return progress stats', async () => {
            const mockPlan = { id: 'plan-1', patient_id: 'p-1', status: 'active', start_date: '2026-03-01' };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [mockPlan] }) // getActivePlanForPatient
                .mockResolvedValueOnce({ rows: [{ count: '10' }] }) // total tasks
                .mockResolvedValueOnce({ rows: [{ count: '8' }] }); // completed tasks

            const res = await request(app)
                .get('/api/v1/patient/recovery-plan/progress')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.plan_id).toBe('plan-1');
            expect(res.body.data.total_tasks).toBe(10);
            expect(res.body.data.completed_tasks).toBe(8);
        });

        it('GET /recovery-plan/:planId: should return specific recovery plan', async () => {
            const mockPlan = { id: 'plan-custom', patient_id: 'p-1', title: 'Custom Plan' };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [mockPlan] })
                .mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .get('/api/v1/patient/recovery-plan/plan-custom')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.id).toBe('plan-custom');
        });
    });

    // ─── 2.3 Calendar ────────────────────────────────────────────────────────
    describe('Calendar Endpoints', () => {
        it('GET /calendar/today: should return today calendar', async () => {
            const today = new Date().toISOString().split('T')[0];
            const mockPlan = { id: 'plan-1', patient_id: 'p-1', status: 'active', start_date: today };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [mockPlan] }) // active plan
                .mockResolvedValueOnce({ rows: [{ id: 'task-1', title: 'Take med' }] }) // tasks
                .mockResolvedValueOnce({ rows: [] }); // completions

            const res = await request(app)
                .get('/api/v1/patient/calendar/today')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.date).toBe(today);
            expect(res.body.data.tasks).toHaveLength(1);
        });

        it('GET /calendar: should return 400 when from or to missing', async () => {
            const res = await request(app)
                .get('/api/v1/patient/calendar?from=2026-03-01')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/from and to query params are required/i);
        });

        it('GET /calendar: should return range data', async () => {
            const mockPlan = { id: 'plan-1', patient_id: 'p-1', status: 'active', start_date: '2026-03-01' };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [mockPlan] }) // active plan
                // Day 1
                .mockResolvedValueOnce({ rows: [] }) // tasks
                .mockResolvedValueOnce({ rows: [] }) // completions
                // Day 2
                .mockResolvedValueOnce({ rows: [] }) // tasks
                .mockResolvedValueOnce({ rows: [] }); // completions

            const res = await request(app)
                .get('/api/v1/patient/calendar?from=2026-03-01&to=2026-03-02')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data).toHaveLength(2);
        });

        it('GET /calendar/:date: should return calendar for specific date', async () => {
            const mockPlan = { id: 'plan-1', patient_id: 'p-1', status: 'active', start_date: '2026-03-01' };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [mockPlan] })
                .mockResolvedValueOnce({ rows: [] })
                .mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .get('/api/v1/patient/calendar/2026-03-05')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.date).toBe('2026-03-05');
        });
    });

    // ─── 2.4 Tasks & Completions ─────────────────────────────────────────────
    describe('Tasks & Completions Endpoints', () => {
        it('POST /tasks: should create patient personal task', async () => {
            const mockPlan = { id: 'plan-1', patient_id: 'p-1', status: 'active' };
            const createdTask = { id: 'task-new', title: 'Walk dogs', recovery_plan_id: 'plan-1' };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [mockPlan] }) // active plan
                .mockResolvedValueOnce({ rows: [createdTask] }); // insert task

            const res = await request(app)
                .post('/api/v1/patient/tasks')
                .set('Authorization', `Bearer ${patientToken}`)
                .send({ title: 'Walk dogs', task_type: 'exercise', start_day: 1 });

            expect(res.status).toBe(201);
            expect(res.body.data.id).toBe('task-new');
        });

        it('GET /tasks/:taskId: should return 404 if task not found', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .get('/api/v1/patient/tasks/unknown-task')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(404);
        });

        it('POST /tasks/:taskId/complete: should mark task as completed', async () => {
            const mockTask = { id: 'task-1' };
            const mockCompletion = { id: 'comp-1', task_id: 'task-1', patient_id: 'p-1', completed: true };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [mockTask] }) // check task belongs to plan
                .mockResolvedValueOnce({ rows: [mockCompletion] }); // upsert completion

            const res = await request(app)
                .post('/api/v1/patient/tasks/task-1/complete')
                .set('Authorization', `Bearer ${patientToken}`)
                .send({ notes: 'Felt good' });

            expect(res.status).toBe(200);
            expect(res.body.data.completed).toBe(true);
        });

        it('PATCH /task-completions/:completionId: should update completion', async () => {
            const mockUpdated = { id: 'comp-1', notes: 'Updated notes' };
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockUpdated] });

            const res = await request(app)
                .patch('/api/v1/patient/task-completions/comp-1')
                .set('Authorization', `Bearer ${patientToken}`)
                .send({ notes: 'Updated notes' });

            expect(res.status).toBe(200);
            expect(res.body.data.notes).toBe('Updated notes');
        });

        it('GET /task-completions: should return completion history', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({
                rows: [{ id: 'comp-1', task_id: 'task-1', completed: true }],
            });

            const res = await request(app)
                .get('/api/v1/patient/task-completions')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });
    });

    // ─── 2.5 Daily Reviews ───────────────────────────────────────────────────
    describe('Daily Reviews Endpoints', () => {
        it('POST /daily-reviews: should submit daily review', async () => {
            const mockReview = { id: 'review-1', patient_id: 'p-1', recovery_score: 8 };

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockReview] });

            const res = await request(app)
                .post('/api/v1/patient/daily-reviews')
                .set('Authorization', `Bearer ${patientToken}`)
                .send({ recovery_score: 8, note: 'Recovering well' });

            expect(res.status).toBe(201);
            expect(res.body.data.recovery_score).toBe(8);
        });

        it('GET /daily-reviews/today: should return 404 if no review today', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .get('/api/v1/patient/daily-reviews/today')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(404);
        });

        it('GET /daily-reviews: should return list of reviews', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({
                rows: [{ id: 'rev-1', recovery_score: 7 }],
            });

            const res = await request(app)
                .get('/api/v1/patient/daily-reviews')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });
    });

    // ─── 2.6 Alerts ──────────────────────────────────────────────────────────
    describe('Alerts Endpoints', () => {
        it('POST /alerts: should return 400 when required fields missing', async () => {
            const res = await request(app)
                .post('/api/v1/patient/alerts')
                .set('Authorization', `Bearer ${patientToken}`)
                .send({ title: 'Pain alert' }); // type and message missing

            expect(res.status).toBe(400);
        });

        it('POST /alerts: should create an alert', async () => {
            const mockAlert = { id: 'alert-1', title: 'High fever', severity: 'critical' };
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ doctor_id: 'doc-1' }] })
                .mockResolvedValueOnce({ rows: [mockAlert] });

            const res = await request(app)
                .post('/api/v1/patient/alerts')
                .set('Authorization', `Bearer ${patientToken}`)
                .send({
                    type: 'symptom',
                    severity: 'critical',
                    title: 'High fever',
                    message: 'Temperature is 103F',
                });

            expect(res.status).toBe(201);
            expect(res.body.data.title).toBe('High fever');
        });

        it('GET /alerts/unread: should return unread alerts', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({
                rows: [{ id: 'a-1', is_read: false }],
            });

            const res = await request(app)
                .get('/api/v1/patient/alerts/unread')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });

        it('PATCH /alerts/:alertId/read: should mark alert as read', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({
                rows: [{ id: 'a-1', is_read: true }],
            });

            const res = await request(app)
                .patch('/api/v1/patient/alerts/a-1/read')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.is_read).toBe(true);
        });

        it('PATCH /alerts/:alertId/dismiss: should dismiss alert', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({
                rows: [{ id: 'a-1', status: 'dismissed' }],
            });

            const res = await request(app)
                .patch('/api/v1/patient/alerts/a-1/dismiss')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe('dismissed');
        });
    });

    // ─── 2.7 Reports & Patient File ──────────────────────────────────────────
    describe('Reports & File Endpoints', () => {
        it('GET /reports: should return patient medical reports', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({
                rows: [{ report_id: 'r-1', report_type: 'discharge_summary' }],
            });

            const res = await request(app)
                .get('/api/v1/patient/reports')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });

        it('GET /reports/:reportId: should return specific report', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({
                rows: [{ report_id: 'r-1', report_type: 'discharge_summary' }],
            });

            const res = await request(app)
                .get('/api/v1/patient/reports/r-1')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.report_id).toBe('r-1');
        });

        it('GET /reports/:reportId/extracted-data: should return AI extracted data', async () => {
            const mockExtracted = {
                id: 'ed-1',
                report_id: 'r-1',
                extracted_data: { procedure: 'ACL Repair' },
            };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ report_id: 'r-1' }] })
                .mockResolvedValueOnce({ rows: [mockExtracted] });

            const res = await request(app)
                .get('/api/v1/patient/reports/r-1/extracted-data')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.extracted_data.procedure).toBe('ACL Repair');
        });

        it('GET /file: should return consolidated patient file', async () => {
            const mockFile = {
                file_id: 'pf-1',
                patient_id: 'p-1',
                medical_history: 'Hypertension',
            };

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockFile] });

            const res = await request(app)
                .get('/api/v1/patient/file')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.file_id).toBe('pf-1');
        });
    });
});
