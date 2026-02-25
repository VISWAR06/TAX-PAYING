import { db } from '../mockData/db';

export const propertyService = {
    getAllProperties: () => {
        return db.data.properties.map(p => {
            const owner = db.data.users.find(u => u.id === p.ownerId);
            return { ...p, ownerName: owner ? owner.name : 'Unknown' };
        });
    },

    getPropertiesByOwner: (ownerId) => {
        return db.data.properties
            .filter(p => p.ownerId === ownerId)
            .map(p => {
                const owner = db.data.users.find(u => u.id === p.ownerId);
                return { ...p, ownerName: owner ? owner.name : 'Unknown' };
            });
    },

    getPropertyById: (id) => {
        const p = db.data.properties.find(p => p.id === id);
        if (!p) return null;
        const owner = db.data.users.find(u => u.id === p.ownerId);
        return { ...p, ownerName: owner ? owner.name : 'Unknown' };
    },

    addProperty: (propertyData) => {
        const newProperty = {
            id: 'p' + Date.now(),
            ...propertyData
        };
        db.data.properties.push(newProperty);
        db.data.auditLogs.push({
            id: Date.now().toString(),
            action: 'ADD_PROPERTY',
            propertyId: newProperty.id,
            timestamp: new Date().toISOString()
        });
        db.save();
        return newProperty;
    },

    updateProperty: (id, updates) => {
        const index = db.data.properties.findIndex(p => p.id === id);
        if (index !== -1) {
            db.data.properties[index] = { ...db.data.properties[index], ...updates };
            db.data.auditLogs.push({
                id: Date.now().toString(),
                action: 'UPDATE_PROPERTY',
                propertyId: id,
                timestamp: new Date().toISOString()
            });
            db.save();
            return true;
        }
        return false;
    }
};
