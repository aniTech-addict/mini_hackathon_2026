import * as PatientService from '../services/patient.service.js';

export const getMyProfile = async (req, res, next) => {
    try {
        const profile = await PatientService.getProfile(req.user.id);
        if (!profile) return res.sendStructuredResponse(404, 'Patient profile not found', null);
        return res.sendStructuredResponse(200, 'Profile fetched', profile);
    } catch (err) {
        next(err);
    }
};

export const updateMyProfile = async (req, res, next) => {
    try {
        const updated = await PatientService.updateProfile(req.user.id, req.body);
        if (!updated) return res.sendStructuredResponse(404, 'Patient profile not found', null);
        return res.sendStructuredResponse(200, 'Profile updated', updated);
    } catch (err) {
        next(err);
    }
};

export const getMyDoctor = async (req, res, next) => {
    try {
        const doctor = await PatientService.getAssignedDoctor(req.user.id);
        if (!doctor) return res.sendStructuredResponse(404, 'No doctor assigned', null);
        return res.sendStructuredResponse(200, 'Assigned doctor fetched', doctor);
    } catch (err) {
        next(err);
    }
};
