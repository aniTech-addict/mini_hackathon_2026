import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_230428';

export const createTestToken = (payload = {}) => {
    const defaultPayload = {
        id: 'user-uuid-1',
        role: 'patient',
        profileId: 'patient-uuid-1',
        ...payload,
    };
    return jwt.sign(defaultPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const createDoctorToken = (payload = {}) => {
    return createTestToken({
        id: 'doctor-user-uuid-1',
        role: 'doctor',
        profileId: 'doctor-uuid-1',
        ...payload,
    });
};

export const createPatientToken = (payload = {}) => {
    return createTestToken({
        id: 'patient-user-uuid-1',
        role: 'patient',
        profileId: 'patient-uuid-1',
        ...payload,
    });
};
