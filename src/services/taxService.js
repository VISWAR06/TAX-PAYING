import { db } from '../mockData/db';

const RATES = {
    residential: 1.2,
    commercial: 3.0,
    industrial: 5.0,
    vacant: 0.5
};

const WATER_TAX_BASE = 500;
const PENALTY_RATE = 0.10; // 10%

export const taxService = {
    calculateTax: (property, year) => {
        const rate = RATES[property.propertyType] || 1.0;
        const propertyTax = Math.round(property.builtupArea * rate);
        const waterTax = ["vacant"].includes(property.propertyType) ? 0 : WATER_TAX_BASE;
        // Current date logic: check if due date passed
        const dueDate = new Date(`${year}-12-31`);
        const isPastDue = new Date() > dueDate;
        const penalty = isPastDue ? Math.round((propertyTax + waterTax) * PENALTY_RATE) : 0;

        return {
            propertyId: property.id,
            year,
            propertyTax,
            waterTax,
            penalty,
            total: propertyTax + waterTax + penalty,
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'unpaid'
        };
    },

    assessTaxesForYear: (year) => {
        let newAssessments = 0;
        db.data.properties.forEach(property => {
            // Check if tax already exists for this property and year
            const exists = db.data.taxes.find(t => t.propertyId === property.id && t.year === year);

            if (!exists) {
                const assessment = taxService.calculateTax(property, year);
                const newTax = {
                    id: 't' + Date.now() + Math.floor(Math.random() * 1000),
                    ...assessment
                };
                db.data.taxes.push(newTax);
                newAssessments++;

                db.data.auditLogs.push({
                    id: Date.now().toString(),
                    action: 'ASSESS_TAX',
                    taxId: newTax.id,
                    timestamp: new Date().toISOString()
                });
            }
        });

        if (newAssessments > 0) {
            db.save();
        }

        return newAssessments;
    },

    getAllTaxes: () => {
        return db.data.taxes.map(t => {
            const prop = db.data.properties.find(p => p.id === t.propertyId);
            const owner = prop ? db.data.users.find(u => u.id === prop.ownerId) : null;
            return {
                ...t,
                address: prop?.address || 'Unknown',
                ownerName: owner?.name || 'Unknown'
            };
        }).sort((a, b) => b.year - a.year);
    },

    getTaxesByUser: (userId) => {
        const userProperties = db.data.properties.filter(p => p.ownerId === userId).map(p => p.id);
        return db.data.taxes.filter(t => userProperties.includes(t.propertyId)).map(t => {
            const prop = db.data.properties.find(p => p.id === t.propertyId);
            return { ...t, address: prop?.address || 'Unknown' };
        }).sort((a, b) => b.year - a.year);
    }
};
