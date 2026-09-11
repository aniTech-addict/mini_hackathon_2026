import { jest } from '@jest/globals';
import request from 'supertest';
import Tesseract from 'tesseract.js';
import { ChatGroq } from '@langchain/groq';
import db from '../db/db.js';
import app from '../index.js';
import { createDoctorToken, createPatientToken } from './helpers/auth.helper.js';
import { extractTextFromImage, structureMedicalData, processReportFile } from '../services/ocr.service.js';

describe('3.3 OCR & AI Processing Tests', () => {
    let doctorToken;

    beforeEach(() => {
        doctorToken = createDoctorToken({ profileId: 'doc-1' });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ─── Service Unit Tests ──────────────────────────────────────────────────
    describe('OCR Service Unit Functions', () => {
        it('extractTextFromImage: should extract text from base64 data URI', async () => {
            const fakeBase64Data = 'data:image/png;base64,' + Buffer.from('image content').toString('base64');
            jest.spyOn(Tesseract, 'recognize').mockResolvedValueOnce({
                data: { text: '  Patient Discharge Summary: ACL Repair  ' },
            });

            const text = await extractTextFromImage(fakeBase64Data);
            expect(text).toBe('Patient Discharge Summary: ACL Repair');
        });

        it('structureMedicalData: should format raw text into structured JSON via LLM', async () => {
            const mockStructured = {
                procedure: 'Total Knee Replacement',
                surgery_date: '2026-03-01',
                medications: [{ name: 'Ibuprofen', dose: '400mg', schedule: ['08:00', '20:00'] }],
            };

            jest.spyOn(ChatGroq.prototype, 'invoke').mockResolvedValueOnce({
                content: `\`\`\`json\n${JSON.stringify(mockStructured)}\n\`\`\``,
            });

            const result = await structureMedicalData('Raw OCR text here...');
            expect(result.procedure).toBe('Total Knee Replacement');
            expect(result.medications).toHaveLength(1);
        });

        it('processReportFile: should orchestrate OCR and LLM structuring', async () => {
            const fakeDataUrl = 'data:image/png;base64,' + Buffer.from('test').toString('base64');

            jest.spyOn(Tesseract, 'recognize').mockResolvedValueOnce({
                data: { text: 'Clinical notes for recovery from appendectomy on 2026-03-01' },
            });

            jest.spyOn(ChatGroq.prototype, 'invoke').mockResolvedValueOnce({
                content: JSON.stringify({ procedure: 'Appendectomy', surgery_date: '2026-03-01' }),
            });

            const output = await processReportFile(fakeDataUrl, 'image/png');
            expect(output.raw_text).toContain('appendectomy');
            expect(output.structured.procedure).toBe('Appendectomy');
        });

        it('processReportFile: should throw error if text is insufficient', async () => {
            const fakeDataUrl = 'data:image/png;base64,' + Buffer.from('blank').toString('base64');

            jest.spyOn(Tesseract, 'recognize').mockResolvedValueOnce({
                data: { text: 'short' },
            });

            await expect(processReportFile(fakeDataUrl, 'image/png')).rejects.toThrow(
                /insufficient text/i
            );
        });
    });

    // ─── API Endpoint Tests ──────────────────────────────────────────────────
    describe('OCR & Extracted Data API Endpoints', () => {
        it('POST /reports/:reportId/process: should return 401 if unauthenticated', async () => {
            const res = await request(app).post('/api/v1/doctor/reports/r-1/process');
            expect(res.status).toBe(401);
        });

        it('POST /reports/:reportId/process: should return 403 for non-doctor users', async () => {
            const patientToken = createPatientToken();
            const res = await request(app)
                .post('/api/v1/doctor/reports/r-1/process')
                .set('Authorization', `Bearer ${patientToken}`);

            expect(res.status).toBe(403);
        });

        it('POST /reports/:reportId/process: should return 404 if report does not belong to doctor', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .post('/api/v1/doctor/reports/r-unknown/process')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/Report not found/i);
        });

        it('POST /reports/:reportId/process: should run OCR & AI processing end-to-end', async () => {
            const mockReport = {
                report_id: 'r-1',
                file_url: 'data:image/png;base64,' + Buffer.from('img').toString('base64'),
                mime_type: 'image/png',
            };

            const mockStructured = {
                procedure: 'Rotator Cuff Repair',
                surgery_date: '2026-03-01',
                medications: [],
            };

            jest.spyOn(Tesseract, 'recognize').mockResolvedValueOnce({
                data: { text: 'Hospital discharge document for Rotator Cuff Repair' },
            });

            jest.spyOn(ChatGroq.prototype, 'invoke').mockResolvedValueOnce({
                content: JSON.stringify(mockStructured),
            });

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [mockReport] }) // ownership check
                .mockResolvedValueOnce({ rows: [] }) // UPDATE to processing
                .mockResolvedValueOnce({ rows: [] }) // UPSERT extracted data
                .mockResolvedValueOnce({ rows: [] }); // UPDATE to completed

            const res = await request(app)
                .post('/api/v1/doctor/reports/r-1/process')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.ocr_status).toBe('completed');
            expect(res.body.data.extracted_data.procedure).toBe('Rotator Cuff Repair');
        });

        it('GET /reports/:reportId/extracted-data: should return extracted clinical data', async () => {
            const mockExtracted = {
                id: 'ed-1',
                report_id: 'r-1',
                extracted_data: { procedure: 'Hip Replacement' },
                parser_version: 'tesseract+llama-3.3-70b-v1',
            };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ report_id: 'r-1' }] }) // verify ownership
                .mockResolvedValueOnce({ rows: [mockExtracted] }); // fetch extracted data

            const res = await request(app)
                .get('/api/v1/doctor/reports/r-1/extracted-data')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.extracted_data.procedure).toBe('Hip Replacement');
        });

        it('GET /reports/:reportId/extracted-data: should return 404 if not found', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ report_id: 'r-1' }] }) // ownership check
                .mockResolvedValueOnce({ rows: [] }); // no data

            const res = await request(app)
                .get('/api/v1/doctor/reports/r-1/extracted-data')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(res.status).toBe(404);
        });

        it('PATCH /reports/:reportId/extracted-data: should return 400 if extracted_data missing', async () => {
            const res = await request(app)
                .patch('/api/v1/doctor/reports/r-1/extracted-data')
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/extracted_data is required/i);
        });

        it('PATCH /reports/:reportId/extracted-data: should update extracted data', async () => {
            const updatedData = { procedure: 'Corrected Procedure Name' };
            const mockRecord = {
                id: 'ed-1',
                report_id: 'r-1',
                extracted_data: updatedData,
            };

            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ report_id: 'r-1' }] }) // ownership check
                .mockResolvedValueOnce({ rows: [mockRecord] }); // update query

            const res = await request(app)
                .patch('/api/v1/doctor/reports/r-1/extracted-data')
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({ extracted_data: updatedData });

            expect(res.status).toBe(200);
            expect(res.body.data.extracted_data.procedure).toBe('Corrected Procedure Name');
        });
    });
});
