import { jest } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import db from '../db/db.js';
import app from '../index.js';
import { createPatientToken, createDoctorToken } from './helpers/auth.helper.js';

describe('Auth API Endpoints (/api/v1/auth)', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('POST /api/v1/auth/register', () => {
        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({ user_id: 'testuser' });

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/required/i);
        });

        it('should return 400 if role is invalid', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    role: 'admin',
                    user_id: 'testuser',
                    password: 'password123',
                    phone_number: '1234567890',
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/Role must be either/i);
        });

        it('should return 409 if user_id already exists', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ id: 'existing-id' }] });

            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    role: 'patient',
                    user_id: 'duplicate_user',
                    password: 'password123',
                    phone_number: '1234567890',
                    email: 'dup@example.com',
                });

            expect(res.status).toBe(409);
            expect(res.body.message).toMatch(/taken|already exists/i);
        });

        it('should register a patient successfully', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [] }) // user check
                .mockResolvedValueOnce({ // insert into users
                    rows: [{
                        id: 'u-uuid-1',
                        role: 'patient',
                        user_id: 'john_doe',
                        phone_number: '9876543210',
                        age: 30,
                        created_at: new Date(),
                    }],
                })
                .mockResolvedValueOnce({ // insert into patients
                    rows: [{ patient_id: 'p-uuid-1' }],
                })
                .mockResolvedValueOnce({ rows: [] }); // insert into patient_files

            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    role: 'patient',
                    user_id: 'john_doe',
                    password: 'password123',
                    phone_number: '9876543210',
                    age: 30,
                    email: 'john@example.com',
                    sex: 'male',
                    address: '123 Street',
                });

            expect(res.status).toBe(201);
            expect(res.body.message).toMatch(/Registration successful/i);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data.user.role).toBe('patient');
            expect(res.body.data.user.profileId).toBe('p-uuid-1');
        });

        it('should register a doctor successfully', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [] }) // user check
                .mockResolvedValueOnce({ // insert into users
                    rows: [{
                        id: 'u-doc-1',
                        role: 'doctor',
                        user_id: 'dr_smith',
                        phone_number: '9876543211',
                        age: 45,
                        created_at: new Date(),
                    }],
                })
                .mockResolvedValueOnce({ // insert into doctors
                    rows: [{ doctor_id: 'd-uuid-1' }],
                });

            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    role: 'doctor',
                    user_id: 'dr_smith',
                    password: 'password123',
                    phone_number: '9876543211',
                    department: 'Orthopedics',
                });

            expect(res.status).toBe(201);
            expect(res.body.data.user.role).toBe('doctor');
            expect(res.body.data.user.profileId).toBe('d-uuid-1');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should return 400 if user_id or password is missing', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ user_id: 'test' });

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/user_id and password are required/i);
        });

        it('should return 401 on invalid user_id', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ user_id: 'nonexistent', password: 'password123' });

            expect(res.status).toBe(401);
            expect(res.body.message).toMatch(/Invalid credentials/i);
        });

        it('should return 401 on wrong password', async () => {
            const hash = await bcrypt.hash('correct_password', 10);
            jest.spyOn(db, 'query').mockResolvedValueOnce({
                rows: [{ id: 'u-1', user_id: 'user1', password_hash: hash, role: 'patient' }],
            });

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ user_id: 'user1', password: 'wrong_password' });

            expect(res.status).toBe(401);
            expect(res.body.message).toMatch(/Invalid credentials/i);
        });

        it('should login successfully with valid credentials', async () => {
            const password = 'valid_password';
            const hash = await bcrypt.hash(password, 10);

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ // find user
                    rows: [{
                        id: 'u-1',
                        user_id: 'patient_user',
                        password_hash: hash,
                        role: 'patient',
                        phone_number: '1234567890',
                        age: 28,
                    }],
                })
                .mockResolvedValueOnce({ // find patient profile
                    rows: [{ patient_id: 'p-1' }],
                });

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ user_id: 'patient_user', password });

            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/Login successful/i);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data.user.profileId).toBe('p-1');
        });
    });

    describe('GET /api/v1/auth/me', () => {
        it('should return 401 without access token', async () => {
            const res = await request(app).get('/api/v1/auth/me');
            expect(res.status).toBe(401);
            expect(res.body.message).toMatch(/Access token missing/i);
        });

        it('should return 403 on invalid token', async () => {
            const res = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', 'Bearer invalid.token.here');
            expect(res.status).toBe(403);
            expect(res.body.message).toMatch(/Invalid or expired token/i);
        });

        it('should return user profile for authenticated patient', async () => {
            const token = createPatientToken({ id: 'u-1', profileId: 'p-1' });

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ // user
                    rows: [{ id: 'u-1', user_id: 'john', role: 'patient', phone_number: '123', age: 30, created_at: new Date() }],
                })
                .mockResolvedValueOnce({ // patient details
                    rows: [{ patient_id: 'p-1', email: 'john@example.com', address: 'Home', sex: 'male' }],
                });

            const res = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.user.user_id).toBe('john');
            expect(res.body.data.profile.patient_id).toBe('p-1');
        });
    });

    describe('POST /api/v1/auth/refresh', () => {
        it('should return 401 without token', async () => {
            const res = await request(app).post('/api/v1/auth/refresh');
            expect(res.status).toBe(401);
        });

        it('should refresh token for authenticated user', async () => {
            const token = createPatientToken();

            const res = await request(app)
                .post('/api/v1/auth/refresh')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/Token refreshed/i);
            expect(res.body.data).toHaveProperty('token');
        });
    });

    describe('POST /api/v1/auth/logout', () => {
        it('should return 200 on logout', async () => {
            const token = createDoctorToken();

            const res = await request(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/Logged out/i);
        });
    });
});
