BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- 1. USERS / AUTHENTICATION
-- =========================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    user_id VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone_number NUMBER NOT NULL UNIQUE,
    age INTEGER CHECK (age IS NULL OR age >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. DOCTORS
-- =========================================================

CREATE TABLE doctors (
    doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    age INTEGER CHECK (age IS NULL OR age >= 0),
    sex VARCHAR(20),
    department VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_doctor_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================================
-- 3. PATIENTS
-- =========================================================

CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    age INTEGER CHECK (age IS NULL OR age >= 0),
    sex UNIQUE CHECK (sex IN ('male', 'female', 'other')),
    address TEXT,
    phone_number NUMBER NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    doctor_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_patient_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_patient_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(doctor_id)
        ON DELETE SET NULL
);

-- =========================================================
-- 4. RECOVERY PLANS
-- One patient can have multiple recovery plans over time.
-- Each plan can be assigned to a doctor.
-- =========================================================

CREATE TABLE recovery_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    plan_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'completed', 'cancelled')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recovery_plan_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_recovery_plan_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(doctor_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_recovery_plan_dates
        CHECK (end_date IS NULL OR end_date >= start_date)
);

-- =========================================================
-- 5. RECOVERY TASKS
-- Defines the activities prescribed inside a recovery plan.
-- =========================================================

CREATE TABLE recovery_tasks (
    task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recovery_plan_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    start_day INTEGER NOT NULL DEFAULT 1 CHECK (start_day >= 1),
    end_day INTEGER CHECK (end_day IS NULL OR end_day >= start_day),
    schedule_times TIME[] NOT NULL DEFAULT '{}',
    duration_minutes INTEGER CHECK (duration_minutes IS NULL OR duration_minutes > 0),
    frequency VARCHAR(100),
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recovery_task_plan
        FOREIGN KEY (recovery_plan_id)
        REFERENCES recovery_plans(id)
        ON DELETE CASCADE
);

-- =========================================================
-- 6. TASK COMPLETION
-- Stores an actual scheduled occurrence of a recovery task.
-- Status: pending / completed / missed.
-- =========================================================

CREATE TABLE task_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    schedule_date DATE NOT NULL,
    schedule_time TIME,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed', 'missed')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_task_completion_task
        FOREIGN KEY (task_id)
        REFERENCES recovery_tasks(task_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_task_completion_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_task_completion_schedule
        UNIQUE (task_id, patient_id, schedule_date, schedule_time)
);

-- =========================================================
-- 7. DAILY REVIEWS
-- Patient's daily recovery feedback.
-- =========================================================

CREATE TABLE daily_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    recovery_plan_id UUID NOT NULL,
    review_date DATE NOT NULL,
    scale NUMERIC(4,2),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_daily_review_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_daily_review_plan
        FOREIGN KEY (recovery_plan_id)
        REFERENCES recovery_plans(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_daily_review
        UNIQUE (patient_id, recovery_plan_id, review_date),

    CONSTRAINT chk_daily_review_scale
        CHECK (scale IS NULL OR (scale >= 0 AND scale <= 10))
);

-- =========================================================
-- 8. ALERTS
-- A single alert table supports both patient and doctor alerts.
-- =========================================================

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    doctor_id UUID,
    task_id UUID,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'low'
        CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unread'
        CHECK (status IN ('unread', 'read', 'resolved', 'dismissed')),
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alert_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_alert_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(doctor_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_alert_task
        FOREIGN KEY (task_id)
        REFERENCES recovery_tasks(task_id)
        ON DELETE SET NULL
);

-- =========================================================
-- 9. MEDICAL / DIAGNOSTIC REPORTS
-- Stores uploaded reports and OCR processing information.
-- =========================================================

CREATE TABLE medical_reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    uploaded_by_user_id UUID,
    report_type VARCHAR(100),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    mime_type VARCHAR(100),
    ocr_status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (ocr_status IN ('pending', 'processing', 'completed', 'failed')),
    ocr_text TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMPTZ,

    CONSTRAINT fk_medical_report_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_medical_report_uploader
        FOREIGN KEY (uploaded_by_user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =========================================================
-- 10. EXTRACTED / PARSED MEDICAL DATA
-- Structured information obtained from OCR.
-- different medical fields.
-- =========================================================

CREATE TABLE report_extracted_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL UNIQUE,
    extracted_data JSONB NOT NULL DEFAULT '{}',
    parser_version VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_extracted_report
        FOREIGN KEY (report_id)
        REFERENCES medical_reports(report_id)
        ON DELETE CASCADE
);

-- =========================================================
-- 11. PATIENT FILE
-- Logical patient record / consolidated medical information.
-- =========================================================

CREATE TABLE patient_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL UNIQUE,
    summary TEXT,
    medical_history JSONB NOT NULL DEFAULT '{}',
    allergies JSONB NOT NULL DEFAULT '[]',
    current_medications JSONB NOT NULL DEFAULT '[]',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_patient_file_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id)
        ON DELETE CASCADE
);

-- =========================================================
-- 12. INDEXES
-- =========================================================

CREATE INDEX idx_patients_doctor_id
    ON patients(doctor_id);

CREATE INDEX idx_recovery_plans_patient_id
    ON recovery_plans(patient_id);

CREATE INDEX idx_recovery_plans_doctor_id
    ON recovery_plans(doctor_id);

CREATE INDEX idx_recovery_plans_status
    ON recovery_plans(status);

CREATE INDEX idx_recovery_tasks_plan_id
    ON recovery_tasks(recovery_plan_id);

CREATE INDEX idx_task_completions_patient_date
    ON task_completions(patient_id, schedule_date);

CREATE INDEX idx_task_completions_task_date
    ON task_completions(task_id, schedule_date);

CREATE INDEX idx_daily_reviews_patient_date
    ON daily_reviews(patient_id, review_date);

CREATE INDEX idx_alerts_patient_status
    ON alerts(patient_id, status);

CREATE INDEX idx_alerts_doctor_status
    ON alerts(doctor_id, status);

CREATE INDEX idx_medical_reports_patient
    ON medical_reports(patient_id);

CREATE INDEX idx_report_extracted_data_json
    ON report_extracted_data USING GIN(extracted_data);

-- =========================================================
-- 13. RELATIONSHIP SUMMARY
-- =========================================================
--
-- users 1 ---- 0/1 patients
-- users 1 ---- 0/1 doctors
--
-- doctors 1 ---- N patients
-- patients 1 ---- N recovery_plans
-- doctors 1 ---- N recovery_plans
-- recovery_plans 1 ---- N recovery_tasks
-- recovery_tasks 1 ---- N task_completions
-- patients 1 ---- N task_completions
-- patients 1 ---- N daily_reviews
-- recovery_plans 1 ---- N daily_reviews
-- patients 1 ---- N alerts
-- doctors 1 ---- N alerts
-- recovery_tasks 1 ---- N alerts
-- patients 1 ---- N medical_reports
-- medical_reports 1 ---- 1 report_extracted_data
-- patients 1 ---- 1 patient_files
--
-- =========================================================

COMMIT;
