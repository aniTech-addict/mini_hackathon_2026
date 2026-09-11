import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// POST /api/v1/auth/register
export const register = async (req, res, next) => {
    const { user_id, password, role, phone_number, age } = req.body;

    if (!user_id || !password || !role || !phone_number) {
        return res.sendStructuredResponse(400, 'user_id, password, role, and phone_number are required', null);
    }

    if (!['patient', 'doctor'].includes(role)) {
        return res.sendStructuredResponse(400, 'Role must be either patient or doctor', null);
    }

    try {
        const existing = await db.query('SELECT id FROM users WHERE user_id = $1', [user_id]);
        if (existing.rows.length > 0) {
            return res.sendStructuredResponse(409, 'user_id already taken', null);
        }

        const password_hash = await bcrypt.hash(password, 10);

        const userResult = await db.query(
            `INSERT INTO users (role, user_id, password_hash, phone_number, age)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, role, user_id, phone_number, age, created_at`,
            [role, user_id, password_hash, phone_number, age || null]
        );

        const user = userResult.rows[0];
        let profileId = null;

        if (role === 'patient') {
            const { email, address, sex } = req.body;
            if (!email) return res.sendStructuredResponse(400, 'email is required for patients', null);

            const patientResult = await db.query(
                `INSERT INTO patients (user_id, age, sex, address, phone_number, email)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING patient_id`,
                [user.id, age || null, sex || null, address || null, phone_number, email]
            );
            profileId = patientResult.rows[0].patient_id;

            // Create empty patient file
            await db.query('INSERT INTO patient_files (patient_id) VALUES ($1)', [profileId]);
        } else if (role === 'doctor') {
            const { department, sex } = req.body;

            const doctorResult = await db.query(
                `INSERT INTO doctors (user_id, age, sex, department)
                 VALUES ($1, $2, $3, $4)
                 RETURNING doctor_id`,
                [user.id, age || null, sex || null, department || null]
            );
            profileId = doctorResult.rows[0].doctor_id;
        }

        const token = generateToken({ id: user.id, role: user.role, profileId });

        return res.sendStructuredResponse(201, 'Registration successful', {
            token,
            user: { id: user.id, user_id: user.user_id, role: user.role, profileId },
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/v1/auth/login
export const login = async (req, res, next) => {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
        return res.sendStructuredResponse(400, 'user_id and password are required', null);
    }

    try {
        const result = await db.query(
            'SELECT id, role, user_id, password_hash FROM users WHERE user_id = $1',
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.sendStructuredResponse(401, 'Invalid credentials', null);
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.sendStructuredResponse(401, 'Invalid credentials', null);
        }

        // Fetch profile id
        let profileId = null;
        if (user.role === 'patient') {
            const p = await db.query('SELECT patient_id FROM patients WHERE user_id = $1', [user.id]);
            profileId = p.rows[0]?.patient_id || null;
        } else if (user.role === 'doctor') {
            const d = await db.query('SELECT doctor_id FROM doctors WHERE user_id = $1', [user.id]);
            profileId = d.rows[0]?.doctor_id || null;
        }

        const token = generateToken({ id: user.id, role: user.role, profileId });

        return res.sendStructuredResponse(200, 'Login successful', {
            token,
            user: { id: user.id, user_id: user.user_id, role: user.role, profileId },
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/auth/me
export const getMe = async (req, res, next) => {
    try {
        const result = await db.query(
            'SELECT id, role, user_id, phone_number, age, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.sendStructuredResponse(404, 'User not found', null);
        }

        const user = result.rows[0];
        let profile = null;

        if (user.role === 'patient') {
            const p = await db.query('SELECT * FROM patients WHERE user_id = $1', [user.id]);
            profile = p.rows[0] || null;
        } else if (user.role === 'doctor') {
            const d = await db.query('SELECT * FROM doctors WHERE user_id = $1', [user.id]);
            profile = d.rows[0] || null;
        }

        return res.sendStructuredResponse(200, 'Authenticated user fetched', { user, profile });
    } catch (err) {
        next(err);
    }
};

// POST /api/v1/auth/refresh
export const refresh = async (req, res, next) => {
    // Stateless JWT: client sends existing valid token, we issue a new one
    try {
        const token = generateToken({
            id: req.user.id,
            role: req.user.role,
            profileId: req.user.profileId,
        });
        return res.sendStructuredResponse(200, 'Token refreshed', { token });
    } catch (err) {
        next(err);
    }
};

// POST /api/v1/auth/logout
export const logout = async (req, res) => {
    // Stateless JWT — client discards the token
    return res.sendStructuredResponse(200, 'Logged out successfully', null);
};
