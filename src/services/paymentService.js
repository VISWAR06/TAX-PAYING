import { db } from '../mockData/db';

export const paymentService = {
    processPayment: (taxId, method) => {
        const taxIndex = db.data.taxes.findIndex(t => t.id === taxId);
        if (taxIndex === -1) return null;

        const tax = db.data.taxes[taxIndex];
        if (tax.status === 'paid') return null;

        // Create payment record
        const payment = {
            id: 'rcpt_' + Date.now(),
            taxId: tax.id,
            propertyId: tax.propertyId,
            amount: tax.total,
            method,
            date: new Date().toISOString(),
            status: 'success'
        };

        db.data.payments.push(payment);

        // Update tax status
        db.data.taxes[taxIndex].status = 'paid';

        // Update finance
        db.data.finance.revenue += tax.total;
        db.data.finance.transactions.push({
            id: 'tx_' + Date.now(),
            type: 'credit',
            amount: tax.total,
            description: `Tax payment for ${taxId}`,
            date: new Date().toISOString()
        });

        // Log audit
        db.data.auditLogs.push({
            id: Date.now().toString(),
            action: 'PROCESS_PAYMENT',
            paymentId: payment.id,
            timestamp: new Date().toISOString()
        });

        db.save();
        return payment;
    },

    getPaymentsByUser: (userId) => {
        const userProperties = db.data.properties.filter(p => p.ownerId === userId).map(p => p.id);
        return db.data.payments.filter(p => userProperties.includes(p.propertyId)).sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    getAllPayments: () => {
        return db.data.payments.sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    getReceiptById: (id) => {
        const payment = db.data.payments.find(p => p.id === id);
        if (!payment) return null;

        const tax = db.data.taxes.find(t => t.id === payment.taxId);
        const property = db.data.properties.find(p => p.id === payment.propertyId);
        const owner = db.data.users.find(u => u.id === property?.ownerId);

        return {
            ...payment,
            taxDetails: tax,
            propertyAddress: property?.address,
            ownerName: owner?.name
        };
    }
};
