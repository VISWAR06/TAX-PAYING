import { db } from '../mockData/db';

export const grievanceService = {
    submitGrievance: (userId, data) => {
        const grievance = {
            id: 'grv_' + Date.now(),
            userId,
            title: data.title,
            description: data.description,
            category: data.category, // e.g. 'water', 'property', 'tax', 'other'
            status: 'pending', // pending, in-progress, resolved
            dateSubmitted: new Date().toISOString(),
            resolution: null,
            dateResolved: null,
            assignedTo: null
        };

        db.data.grievances.push(grievance);

        db.data.auditLogs.push({
            id: Date.now().toString(),
            action: 'SUBMIT_GRIEVANCE',
            grievanceId: grievance.id,
            timestamp: new Date().toISOString()
        });

        db.save();
        return grievance;
    },

    getAllGrievances: () => {
        return db.data.grievances.map(g => {
            const citizen = db.data.users.find(u => u.id === g.userId);
            return { ...g, citizenName: citizen ? citizen.name : 'Unknown' };
        }).sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));
    },

    getGrievancesByUser: (userId) => {
        return db.data.grievances.filter(g => g.userId === userId)
            .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));
    },

    updateGrievanceStatus: (id, status, resolution) => {
        const index = db.data.grievances.findIndex(g => g.id === id);
        if (index !== -1) {
            db.data.grievances[index].status = status;
            if (resolution) {
                db.data.grievances[index].resolution = resolution;
            }
            if (status === 'resolved') {
                db.data.grievances[index].dateResolved = new Date().toISOString();
            }

            db.data.auditLogs.push({
                id: Date.now().toString(),
                action: 'UPDATE_GRIEVANCE',
                grievanceId: id,
                timestamp: new Date().toISOString()
            });

            db.save();
            return true;
        }
        return false;
    }
};
