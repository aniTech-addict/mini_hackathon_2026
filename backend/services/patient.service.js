import db from '../db/db.js';

export const getProfile = async (userId) => {
    const result = await db.query(
        `SELECT p.*, u.user_id, u.role, u.phone_number AS user_phone, u.created_at AS user_created_at
         FROM patients p
         JOIN users u ON u.id = p.user_id
         WHERE p.user_id = $1`,
        [userId]
    );
    return result.rows[0] || null;
};

export const updateProfile = async (userId, fields) => {
    const { age, sex, address, email, phone_number } = fields;

    const result = await db.query(
        `UPDATE patients
         SET age = COALESCE($1, age),
             sex = COALESCE($2, sex),
             address = COALESCE($3, address),
             email = COALESCE($4, email),
             phone_number = COALESCE($5, phone_number),
             updated_at = NOW()
         WHERE user_id = $6
         RETURNING *`,
        [age, sex, address, email, phone_number, userId]
    );
    return result.rows[0] || null;
};

export const getAssignedDoctor = async (userId) => {
    const patientRes = await db.query(
        'SELECT doctor_id FROM patients WHERE user_id = $1',
        [userId]
    );

    const patient = patientRes.rows[0];
    if (!patient || !patient.doctor_id) return null;

    const doctorRes = await db.query(
        `SELECT d.*, u.user_id AS doctor_user_id, u.phone_number AS doctor_phone
         FROM doctors d
         JOIN users u ON u.id = d.user_id
         WHERE d.doctor_id = $1`,
        [patient.doctor_id]
    );
    return doctorRes.rows[0] || null;
};
