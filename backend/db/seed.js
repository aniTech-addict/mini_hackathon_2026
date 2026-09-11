import 'dotenv/config';
import bcrypt from 'bcryptjs';
import db from './db.js';

const password = 'RecoverPlus123!';
const passwordHash = await bcrypt.hash(password, 10);

const doctors = [
    {
        userId: '00000000-0000-0000-0000-000000000001',
        doctorId: '10000000-0000-0000-0000-000000000001',
        user_id: 'doctor.ananya',
        username: 'ananya_mehta',
        phone: 910000001,
        age: 42,
        sex: 'female',
        department: 'Orthopedic Surgery',
    },
    {
        userId: '00000000-0000-0000-0000-000000000002',
        doctorId: '10000000-0000-0000-0000-000000000002',
        user_id: 'doctor.arjun',
        username: 'arjun_rao',
        phone: 910000002,
        age: 39,
        sex: 'male',
        department: 'General Surgery',
    },
];

const patients = [
    {
        userId: '00000000-0000-0000-0000-000000000101',
        patientId: '20000000-0000-0000-0000-000000000101',
        user_id: 'patient.rahul',
        username: 'rahul_sharma',
        phone: 920000001,
        age: 58,
        sex: 'male',
        email: 'rahul.sharma@example.com',
        address: '12 Lake View Road, Pune',
        doctorId: doctors[0].doctorId,
        procedure: 'Total Knee Replacement',
    },
    {
        userId: '00000000-0000-0000-0000-000000000102',
        patientId: '20000000-0000-0000-0000-000000000102',
        user_id: 'patient.priya',
        username: 'priya_nair',
        phone: 920000002,
        age: 46,
        sex: 'female',
        email: 'priya.nair@example.com',
        address: '8 Palm Grove, Bengaluru',
        doctorId: doctors[0].doctorId,
        procedure: 'ACL Reconstruction',
    },
    {
        userId: '00000000-0000-0000-0000-000000000103',
        patientId: '20000000-0000-0000-0000-000000000103',
        user_id: 'patient.vikram',
        username: 'vikram_patel',
        phone: 920000003,
        age: 62,
        sex: 'male',
        email: 'vikram.patel@example.com',
        address: '44 Civil Lines, Ahmedabad',
        doctorId: doctors[1].doctorId,
        procedure: 'Hernia Repair',
    },
    {
        userId: '00000000-0000-0000-0000-000000000104',
        patientId: '20000000-0000-0000-0000-000000000104',
        user_id: 'patient.meera',
        username: 'meera_iyer',
        phone: 920000004,
        age: 35,
        sex: 'female',
        email: 'meera.iyer@example.com',
        address: '21 Residency Road, Chennai',
        doctorId: doctors[1].doctorId,
        procedure: 'Gallbladder Surgery',
    },
    {
        userId: '00000000-0000-0000-0000-000000000105',
        patientId: '20000000-0000-0000-0000-000000000105',
        user_id: 'patient.omkar',
        username: 'omkar_joshi',
        phone: 920000005,
        age: 51,
        sex: 'male',
        email: 'omkar.joshi@example.com',
        address: '5 Hill Street, Nashik',
        doctorId: doctors[0].doctorId,
        procedure: 'Shoulder Arthroscopy',
    },
    {
        userId: '00000000-0000-0000-0000-000000000106',
        patientId: '20000000-0000-0000-0000-000000000106',
        user_id: 'patient.fatima',
        username: 'fatima_khan',
        phone: 920000006,
        age: 29,
        sex: 'female',
        email: 'fatima.khan@example.com',
        address: '17 Garden Avenue, Hyderabad',
        doctorId: doctors[1].doctorId,
        procedure: 'Appendectomy',
    },
];

const dateOffset = (days) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
};

const seed = async () => {
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        for (const doctor of doctors) {
            await client.query(
                `INSERT INTO users (id, role, user_id, password_hash, phone_number, username, age)
                 VALUES ($1, 'doctor', $2, $3, $4, $5, $6)
                 ON CONFLICT (user_id) DO UPDATE SET
                    password_hash = EXCLUDED.password_hash,
                    phone_number = EXCLUDED.phone_number,
                    username = EXCLUDED.username,
                    age = EXCLUDED.age`,
                [
                    doctor.userId,
                    doctor.user_id,
                    passwordHash,
                    doctor.phone,
                    doctor.username,
                    doctor.age,
                ]
            );

            await client.query(
                `INSERT INTO doctors (doctor_id, user_id, age, sex, department)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (user_id) DO UPDATE SET
                    age = EXCLUDED.age,
                    sex = EXCLUDED.sex,
                    department = EXCLUDED.department`,
                [
                    doctor.doctorId,
                    doctor.userId,
                    doctor.age,
                    doctor.sex,
                    doctor.department,
                ]
            );
        }

        for (const patient of patients) {
            await client.query(
                `INSERT INTO users (id, role, user_id, password_hash, phone_number, username, age)
                 VALUES ($1, 'patient', $2, $3, $4, $5, $6)
                 ON CONFLICT (user_id) DO UPDATE SET
                    password_hash = EXCLUDED.password_hash,
                    phone_number = EXCLUDED.phone_number,
                    username = EXCLUDED.username,
                    age = EXCLUDED.age`,
                [
                    patient.userId,
                    patient.user_id,
                    passwordHash,
                    patient.phone,
                    patient.username,
                    patient.age,
                ]
            );

            await client.query(
                `INSERT INTO patients (patient_id, user_id, age, sex, address, phone_number, email, doctor_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (user_id) DO UPDATE SET
                    age = EXCLUDED.age,
                    sex = EXCLUDED.sex,
                    address = EXCLUDED.address,
                    phone_number = EXCLUDED.phone_number,
                    email = EXCLUDED.email,
                    doctor_id = EXCLUDED.doctor_id`,
                [
                    patient.patientId,
                    patient.userId,
                    patient.age,
                    patient.sex,
                    patient.address,
                    patient.phone,
                    patient.email,
                    patient.doctorId,
                ]
            );

            await client.query(
                `INSERT INTO patient_files (patient_id, summary, medical_history, allergies, current_medications)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (patient_id) DO UPDATE SET
                    summary = EXCLUDED.summary,
                    medical_history = EXCLUDED.medical_history,
                    allergies = EXCLUDED.allergies,
                    current_medications = EXCLUDED.current_medications,
                    updated_at = NOW()`,
                [
                    patient.patientId,
                    `Post-operative recovery after ${patient.procedure}.`,
                    JSON.stringify({
                        procedure: patient.procedure,
                        riskLevel: 'standard',
                    }),
                    JSON.stringify([]),
                    JSON.stringify([]),
                ]
            );
        }

        for (const [index, patient] of patients.entries()) {
            const planId = `30000000-0000-0000-0000-0000000001${String(index + 1).padStart(2, '0')}`;
            const startDate = dateOffset(-2);
            const endDate = dateOffset(28);

            await client.query(
                `INSERT INTO recovery_plans (id, patient_id, doctor_id, title, start_date, end_date, status)
                 VALUES ($1, $2, $3, $4, $5, $6, 'active')
                 ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    start_date = EXCLUDED.start_date,
                    end_date = EXCLUDED.end_date,
                    status = EXCLUDED.status,
                    updated_at = NOW()`,
                [
                    planId,
                    patient.patientId,
                    patient.doctorId,
                    `${patient.procedure} Recovery Plan`,
                    startDate,
                    endDate,
                ]
            );

            const tasks = [
                [
                    'Take prescribed medication',
                    'Medication reminders and dosage adherence.',
                    'MEDICATION',
                    ['08:00', '20:00'],
                    10,
                    'DAILY',
                    true,
                ],
                [
                    'Complete gentle walking exercise',
                    'Walk with support as tolerated.',
                    'EXERCISE',
                    ['11:00'],
                    10,
                    'DAILY',
                    true,
                ],
                [
                    'Inspect and clean the wound',
                    'Check for redness, swelling, or unusual discharge.',
                    'WOUND_CARE',
                    ['18:00'],
                    15,
                    'DAILY',
                    true,
                ],
            ];

            for (const [taskIndex, task] of tasks.entries()) {
                const taskId = `40000000-0000-0000-0000-00000000${String(index + 1).padStart(2, '0')}${String(taskIndex + 1).padStart(2, '02')}`;
                await client.query(
                    `INSERT INTO recovery_tasks
                        (task_id, recovery_plan_id, title, description, category, start_day, end_day, schedule_times, duration_minutes, frequency, is_required)
                     VALUES ($1, $2, $3, $4, $5, 1, 30, $6, $7, $8, $9)
                     ON CONFLICT (task_id) DO UPDATE SET
                        title = EXCLUDED.title,
                        description = EXCLUDED.description,
                        category = EXCLUDED.category,
                        schedule_times = EXCLUDED.schedule_times,
                        duration_minutes = EXCLUDED.duration_minutes,
                        frequency = EXCLUDED.frequency,
                        is_required = EXCLUDED.is_required,
                        updated_at = NOW()`,
                    [
                        taskId,
                        planId,
                        task[0],
                        task[1],
                        task[2],
                        task[3],
                        task[4],
                        task[5],
                        task[6],
                    ]
                );

                await client.query(
                    `INSERT INTO task_completions (task_id, patient_id, schedule_date, schedule_time, notes, status, completed_at)
                     VALUES ($1, $2, $3::date, $4::time, $5, $6::varchar, CASE WHEN $6::varchar = 'completed' THEN NOW() ELSE NULL END)
                     ON CONFLICT (task_id, patient_id, schedule_date, schedule_time) DO UPDATE SET
                        notes = EXCLUDED.notes,
                        status = EXCLUDED.status,
                        completed_at = EXCLUDED.completed_at,
                        updated_at = NOW()`,
                    [
                        taskId,
                        patient.patientId,
                        dateOffset(-1),
                        task[3][0],
                        taskIndex === 1
                            ? 'Completed with family support.'
                            : null,
                        index === 2 && taskIndex === 1 ? 'missed' : 'completed',
                    ]
                );
            }

            await client.query(
                `INSERT INTO daily_reviews (patient_id, recovery_plan_id, review_date, scale, note)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (patient_id, recovery_plan_id, review_date) DO UPDATE SET
                    scale = EXCLUDED.scale,
                    note = EXCLUDED.note,
                    updated_at = NOW()`,
                [
                    patient.patientId,
                    planId,
                    dateOffset(-1),
                    index === 0 ? 7.5 : 8 + (index % 3) / 2,
                    index === 0
                        ? 'Feeling sore but able to move with walker.'
                        : 'Recovery is progressing well.',
                ]
            );

            if (index === 0 || index === 2) {
                await client.query(
                    `INSERT INTO alerts (id, patient_id, doctor_id, type, severity, title, message, status)
                     VALUES ($1, $2, $3, 'DAILY_REVIEW_FLAGGED', $4, $5, $6, 'unread')
                     ON CONFLICT (id) DO UPDATE SET
                        severity = EXCLUDED.severity,
                        title = EXCLUDED.title,
                        message = EXCLUDED.message,
                        status = EXCLUDED.status`,
                    [
                        `50000000-0000-0000-0000-00000000000${index + 1}`,
                        patient.patientId,
                        patient.doctorId,
                        index === 0 ? 'high' : 'medium',
                        index === 0
                            ? 'Increased post-operative pain'
                            : 'Recovery check-in required',
                        index === 0
                            ? 'Patient reported increased pain and a warm, red knee.'
                            : 'Patient missed a scheduled recovery task.',
                    ]
                );
            }
        }

        await client.query('COMMIT');
        console.log(
            `Seed complete: ${doctors.length} doctors and ${patients.length} patients created.`
        );
        console.log(`Login password for all seeded accounts: ${password}`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Seed failed:', error.message);
        process.exitCode = 1;
    } finally {
        client.release();
        await db.pool.end();
    }
};

await seed();
