export const initialData = {
    users: [
        { id: '1', name: 'Admin User', email: 'admin@municipal.gov', role: 'admin', password: 'password' },
        { id: '2', name: 'Staff Officer 1', email: 'staff@municipal.gov', role: 'staff', password: 'password' },
        { id: '3', name: 'John Doe', email: 'citizen@example.com', role: 'citizen', password: 'password' },
    ],
    properties: [
        { id: 'p1', ownerId: '3', builtupArea: 1500, propertyType: 'residential', address: '123 Main St, Block A', taxAssessmentId: 't1' }
    ],
    taxes: [
        { id: 't1', propertyId: 'p1', year: 2024, propertyTax: 1500, waterTax: 500, penalty: 0, status: 'unpaid', dueDate: '2024-12-31' }
    ],
    payments: [],
    grievances: [],
    finance: {
        revenue: 500000,
        expenses: 200000,
        transactions: []
    },
    auditLogs: []
};

// Simple singleton to simulate DB
class MockDB {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('municipalDB'));
        if (!this.data) {
            this.data = JSON.parse(JSON.stringify(initialData));
            this.save();
        }
    }

    save() {
        localStorage.setItem('municipalDB', JSON.stringify(this.data));
    }
}

export const db = new MockDB();
