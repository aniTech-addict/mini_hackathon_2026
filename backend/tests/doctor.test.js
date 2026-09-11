import { jest } from '@jest/globals';
import request from 'supertest';
import db from '../db/db.js';
import app from '../index.js';
import { createDoctorToken, createPatientToken } from './helpers/auth.helper.js';

describe('Doctor API Endpoints (/api/v1/doctor)', () => {
    let doctorToken;

    beforeEach(() => {
        doctorToken = createDoctorToken({ profileId: 'doc-1' });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ─── Auth & Role Check ───────────────────────────────────────────────────
    describe('Authentication & Role Check', () => {
        it('should return 401 if unauthenticated', async () => {
            const res = await request(app).get('/api/v1/doctor/patients');
            expect(res.status).toBe(401);
        });

        it('should return 403 if user is a patient', async () => {
            const patientToken = createPatientToken();
            const res = await request(app)
                .get('/api/v1/doctor/patients')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(403);
            expect(res.body.message).toMatch(/Required role\(s\): doctor/i);
        });
    });

    // ─── 3.1 Patient Management ──────────────────────────────────────────────
    describe('3.1 Patient Management', () => {
        it('GET /patients: should return assigned patients list', async () => {
            const mockPatients = [
                { patient_id: 'p-1', username: 'john_doe', age: 35, sex: 'male' },
                { patient_id: 'p-2', username: 'jane_doe', age: 29, sex: 'female' },
            ];
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockPatients });

            const res = await request(app)
                .get('/api/v1/doctor/patients')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(2);
        });

        it('GET /patients/:patientId: should return 404 if patient not assigned', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .get('/api/v1/doctor/patients/unknown-patient')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(404);
        });

        it('GET /patients/:patientId: should return patient details', async () => {
            const mockPatient = { patient_id: 'p-1', age: 35, email: 'john@test.com' };
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockPatient] });

            const res = await request(app)
                .get('/api/v1/doctor/patients/p-1')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.patient_id).toBe('p-1');
        });

        it('GET /patients/:patientId/file: should return patient file', async () => {
            const mockFile = { file_id: 'pf-1', patient_id: 'p-1', allergies: 'Penicillin' };
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ patient_id: 'p-1' }] }) // verify ownership
                .mockResolvedValueOnce({ rows: [mockFile] }); // fetch file

            const res = await request(app)
                .get('/api/v1/doctor/patients/p-1/file')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.allergies).toBe('Penicillin');
        });
    });

    // ─── 3.2 Medical Reports ─────────────────────────────────────────────────
    describe('3.2 Medical Reports', () => {
        it('POST /patients/:patientId/reports: should return 400 if no file attached', async () => {
            const res = await request(app)
                .post('/api/v1/doctor/patients/p-1/reports')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/No file uploaded/i);
        });

        it('POST /patients/:patientId/reports: should upload report with multipart/form-data', async () => {
            const mockReport = { report_id: 'r-1', patient_id: 'p-1', ocr_status: 'pending' };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ patient_id: 'p-1' }] }) // verify ownership
                .mockResolvedValueOnce({ rows: [mockReport] }); // insert report

            const fileBuffer = Buffer.from('fake image content');

            const res = await request(app)
                .post('/api/v1/doctor/patients/p-1/reports')
                .set('Authorization', `Bearer ${doctorToken}`)
                .attach('file', fileBuffer, 'discharge_summary.png')
                .field('report_type', 'discharge_summary');

            expect(res.status).toBe(201);
            expect(res.body.data.report_id).toBe('r-1');
        });

        it('GET /patients/:patientId/reports: should return reports list', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ patient_id: 'p-1' }] }) // verify ownership
                .mockResolvedValueOnce({ rows: [{ report_id: 'r-1' }] }); // fetch reports

            const res = await request(app)
                .get('/api/v1/doctor/patients/p-1/reports')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });

        it('GET /reports/:reportId: should return report details', async () => {
            const mockReport = { report_id: 'r-1', ocr_status: 'completed' };
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockReport] });

            const res = await request(app)
                .get('/api/v1/doctor/reports/r-1')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.ocr_status).toBe('completed');
        });

        it('GET /reports/:reportId/status: should return report ocr_status', async () => {
            const mockStatus = { report_id: 'r-1', ocr_status: 'processing' };
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockStatus] });

            const res = await request(app)
                .get('/api/v1/doctor/reports/r-1/status')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.ocr_status).toBe('processing');
        });
    });

    // ─── 3.4 Recovery Plan Generation ────────────────────────────────────────
    describe('3.4 Recovery Plans', () => {
        it('POST /patients/:patientId/recovery-plans/generate: should return 403 if patient not assigned', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .post('/api/v1/doctor/patients/p-unknown/recovery-plans/generate')
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({ report_id: 'r-1' });

            expect(res.status).toBe(403);
        });

        it('POST /patients/:patientId/recovery-plans/generate: should generate recovery plan draft', async () => {
            const mockPlan = { id: 'plan-draft-1', patient_id: 'p-1', status: 'draft' };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ patient_id: 'p-1' }] }) // patient ownership check
                .mockResolvedValueOnce({ rows: [{ report_id: 'r-1' }] }) // report check
                .mockResolvedValueOnce({ rows: [mockPlan] }) // insert recovery plan
                .mockResolvedValueOnce({ rows: [{ id: 't-1' }] }) // task 1
                .mockResolvedValueOnce({ rows: [{ id: 't-2' }] }) // task 2
                .mockResolvedValueOnce({ rows: [{ id: 't-3' }] }); // task 3

            const res = await request(app)
                .post('/api/v1/doctor/patients/p-1/recovery-plans/generate')
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({ report_id: 'r-1' });

            expect(res.status).toBe(201);
            expect(res.body.data.id).toBe('plan-draft-1');
            expect(res.body.data.tasks).toHaveLength(3);
        });

        it('GET /patients/:patientId/recovery-plans: should return all patient plans', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ patient_id: 'p-1' }] })
                .mockResolvedValueOnce({ rows: [{ id: 'plan-1', status: 'active' }] });

            const res = await request(app)
                .get('/api/v1/doctor/patients/p-1/recovery-plans')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });

        it('GET /recovery-plans/:planId: should return plan with tasks', async () => {
            const mockPlan = { id: 'plan-1', status: 'draft' };
            const mockTasks = [{ id: 'task-1', title: 'Medication' }];

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [mockPlan] }) // plan query
                .mockResolvedValueOnce({ rows: mockTasks }); // tasks query

            const res = await request(app)
                .get('/api/v1/doctor/recovery-plans/plan-1')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.id).toBe('plan-1');
            expect(res.body.data.tasks).toHaveLength(1);
        });

        it('PATCH /recovery-plans/:planId: should update draft recovery plan', async () => {
            const mockUpdated = { id: 'plan-1', title: 'Updated Plan Title', status: 'draft' };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ id: 'plan-1' }] }) // verify ownership & draft status
                .mockResolvedValueOnce({ rows: [mockUpdated] }); // update query

            const res = await request(app)
                .patch('/api/v1/doctor/recovery-plans/plan-1')
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({ title: 'Updated Plan Title' });

            expect(res.status).toBe(200);
            expect(res.body.data.title).toBe('Updated Plan Title');
        });

        it('POST /recovery-plans/:planId/approve: should approve draft plan to active', async () => {
            const mockApproved = { id: 'plan-1', status: 'active' };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ id: 'plan-1' }] }) // verify ownership
                .mockResolvedValueOnce({ rows: [mockApproved] }); // approve update

            const res = await request(app)
                .post('/api/v1/doctor/recovery-plans/plan-1/approve')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe('active');
        });

        it('POST /recovery-plans/:planId/cancel: should cancel plan', async () => {
            const mockCancelled = { id: 'plan-1', status: 'cancelled' };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ id: 'plan-1' }] }) // verify
                .mockResolvedValueOnce({ rows: [mockCancelled] }); // cancel update

            const res = await request(app)
                .post('/api/v1/doctor/recovery-plans/plan-1/cancel')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe('cancelled');
        });
    });

    // ─── 3.5 Tasks ───────────────────────────────────────────────────────────
    describe('3.5 Tasks', () => {
        it('POST /recovery-plans/:planId/tasks: should add a task to plan', async () => {
            const mockTask = { id: 'task-1', recovery_plan_id: 'plan-1', title: 'Wound care' };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ id: 'plan-1' }] }) // verify plan
                .mockResolvedValueOnce({ rows: [mockTask] }); // insert task

            const res = await request(app)
                .post('/api/v1/doctor/recovery-plans/plan-1/tasks')
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({
                    title: 'Wound care',
                    task_type: 'wound_care',
                    start_day: 1,
                    end_day: 7,
                });

            expect(res.status).toBe(201);
            expect(res.body.data.title).toBe('Wound care');
        });

        it('GET /recovery-plans/:planId/tasks: should return all tasks of plan', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ id: 'plan-1' }] })
                .mockResolvedValueOnce({ rows: [{ id: 'task-1' }, { id: 'task-2' }] });

            const res = await request(app)
                .get('/api/v1/doctor/recovery-plans/plan-1/tasks')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(2);
        });

        it('GET /tasks/:taskId: should return task details', async () => {
            const mockTask = { id: 'task-1', title: 'Exercise' };
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockTask] });

            const res = await request(app)
                .get('/api/v1/doctor/tasks/task-1')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.title).toBe('Exercise');
        });

        it('PATCH /tasks/:taskId: should update task', async () => {
            const mockUpdated = { id: 'task-1', title: 'Updated Exercise' };
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ id: 'task-1' }] })
                .mockResolvedValueOnce({ rows: [mockUpdated] });

            const res = await request(app)
                .patch('/api/v1/doctor/tasks/task-1')
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({ title: 'Updated Exercise' });

            expect(res.status).toBe(200);
            expect(res.body.data.title).toBe('Updated Exercise');
        });

        it('DELETE /tasks/:taskId: should delete task', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ id: 'task-1' }] })
                .mockResolvedValueOnce({ rows: [{ id: 'task-1' }] });

            const res = await request(app)
                .delete('/api/v1/doctor/tasks/task-1')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/Task deleted/i);
        });
    });

    // ─── 3.6 Adherence & Reviews ─────────────────────────────────────────────
    describe('3.6 Adherence & Reviews', () => {
        it('GET /patients/:patientId/task-completions: should return patient completions', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ patient_id: 'p-1' }] })
                .mockResolvedValueOnce({ rows: [{ id: 'comp-1', completed: true }] });

            const res = await request(app)
                .get('/api/v1/doctor/patients/p-1/task-completions')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });

        it('GET /patients/:patientId/adherence: should return adherence stats', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ patient_id: 'p-1' }] }) // patient check
                .mockResolvedValueOnce({ rows: [{ total: '10' }] }) // total
                .mockResolvedValueOnce({ rows: [{ completed: '9' }] }) // completed
                .mockResolvedValueOnce({ rows: [{ missed: '1' }] }); // missed

            const res = await request(app)
                .get('/api/v1/doctor/patients/p-1/adherence')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.adherence_rate).toBe('90.0%');
            expect(res.body.data.completed).toBe(9);
            expect(res.body.data.missed).toBe(1);
        });

        it('GET /patients/:patientId/daily-reviews/latest: should return latest daily review', async () => {
            const mockReview = { id: 'rev-latest', recovery_score: 9, note: 'Walking well' };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ patient_id: 'p-1' }] })
                .mockResolvedValueOnce({ rows: [mockReview] });

            const res = await request(app)
                .get('/api/v1/doctor/patients/p-1/daily-reviews/latest')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.recovery_score).toBe(9);
        });

        it('GET /patients/:patientId/daily-reviews: should return review history', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ patient_id: 'p-1' }] })
                .mockResolvedValueOnce({ rows: [{ id: 'rev-1' }, { id: 'rev-2' }] });

            const res = await request(app)
                .get('/api/v1/doctor/patients/p-1/daily-reviews')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(2);
        });
    });

    // ─── 3.7 Doctor Alerts ───────────────────────────────────────────────────
    describe('3.7 Doctor Alerts', () => {
        it('GET /alerts/unread: should return unread alerts', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({
                rows: [{ id: 'alert-1', is_read: false, severity: 'critical' }],
            });

            const res = await request(app)
                .get('/api/v1/doctor/alerts/unread')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });

        it('GET /alerts: should return all alerts for doctor', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({
                rows: [{ id: 'alert-1' }, { id: 'alert-2' }],
            });

            const res = await request(app)
                .get('/api/v1/doctor/alerts')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(2);
        });

        it('PATCH /alerts/:alertId/read: should mark alert read', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ id: 'alert-1' }] })
                .mockResolvedValueOnce({ rows: [{ id: 'alert-1', is_read: true }] });

            const res = await request(app)
                .patch('/api/v1/doctor/alerts/alert-1/read')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.is_read).toBe(true);
        });

        it('PATCH /alerts/:alertId/resolve: should resolve alert', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ id: 'alert-1' }] })
                .mockResolvedValueOnce({ rows: [{ id: 'alert-1', status: 'resolved' }] });

            const res = await request(app)
                .patch('/api/v1/doctor/alerts/alert-1/resolve')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe('resolved');
        });
    });
});
