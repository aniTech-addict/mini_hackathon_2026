import { jest } from '@jest/globals';
import request from 'supertest';
import db from '../db/db.js';
import app from '../index.js';
import { createPatientToken, createDoctorToken } from './helpers/auth.helper.js';

describe('Patient Profile API Endpoints (/api/v1/patients)', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('GET /api/v1/patients/me', () => {
        it('should return 401 when token is missing', async () => {
            const res = await request(app).get('/api/v1/patients/me');
            expect(res.status).toBe(401);
        });

        it('should return 403 when user is a doctor instead of a patient', async () => {
            const doctorToken = createDoctorToken();
            const res = await request(app)
                .get('/api/v1/patients/me')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(403);
            expect(res.body.message).toMatch(/Required role\(s\): patient/i);
        });

        it('should return 404 if patient profile does not exist', async () => {
            const patientToken = createPatientToken({ id: 'u-missing' });
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .get('/api/v1/patients/me')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/Patient profile not found/i);
        });

        it('should return 200 and patient profile when authenticated', async () => {
            const patientToken = createPatientToken({ id: 'u-123' });
            const mockProfile = {
                patient_id: 'p-123',
                user_id: 'john_doe',
                role: 'patient',
                age: 32,
                sex: 'male',
                email: 'john@example.com',
                address: 'Baker Street',
            };

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockProfile] });

            const res = await request(app)
                .get('/api/v1/patients/me')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/Profile fetched/i);
            expect(res.body.data.patient_id).toBe('p-123');
            expect(res.body.data.email).toBe('john@example.com');
        });
    });

    describe('PATCH /api/v1/patients/me', () => {
        it('should return 401 when unauthenticated', async () => {
            const res = await request(app)
                .patch('/api/v1/patients/me')
                .send({ address: 'New Address' });
            expect(res.status).toBe(401);
        });

        it('should return 404 when updating nonexistent profile', async () => {
            const patientToken = createPatientToken({ id: 'u-unknown' });
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .patch('/api/v1/patients/me')
                .set('Authorization', `Bearer ${patientToken}`)
                .send({ age: 35 });

            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/Patient profile not found/i);
        });

        it('should return 200 and update profile fields', async () => {
            const patientToken = createPatientToken({ id: 'u-123' });
            const updatedProfile = {
                patient_id: 'p-123',
                age: 35,
                address: '742 Evergreen Terrace',
                email: 'john_updated@example.com',
            };

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedProfile] });

            const res = await request(app)
                .patch('/api/v1/patients/me')
                .set('Authorization', `Bearer ${patientToken}`)
                .send({
                    age: 35,
                    address: '742 Evergreen Terrace',
                    email: 'john_updated@example.com',
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/Profile updated/i);
            expect(res.body.data.address).toBe('742 Evergreen Terrace');
        });
    });

    describe('GET /api/v1/patients/me/doctor', () => {
        it('should return 404 when patient has no assigned doctor', async () => {
            const patientToken = createPatientToken({ id: 'u-123' });
            // patient found, but doctor_id is null
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ doctor_id: null }] });

            const res = await request(app)
                .get('/api/v1/patients/me/doctor')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/No doctor assigned/i);
        });

        it('should return 200 with doctor information when doctor is assigned', async () => {
            const patientToken = createPatientToken({ id: 'u-123' });
            const mockDoctor = {
                doctor_id: 'doc-456',
                department: 'Cardiology',
                doctor_user_id: 'dr_house',
                doctor_phone: '555-1234',
            };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ doctor_id: 'doc-456' }] }) // patient check
                .mockResolvedValueOnce({ rows: [mockDoctor] }); // doctor details

            const res = await request(app)
                .get('/api/v1/patients/me/doctor')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/Assigned doctor fetched/i);
            expect(res.body.data.doctor_id).toBe('doc-456');
            expect(res.body.data.department).toBe('Cardiology');
        });
    });
});
