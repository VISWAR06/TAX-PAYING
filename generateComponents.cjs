const fs = require('fs');
const path = require('path');

const pages = [
    'auth/Login', 'auth/Register',
    'dashboard/AdminDashboard', 'dashboard/CitizenDashboard', 'dashboard/StaffDashboard',
    'properties/PropertyList', 'properties/PropertyDetails', 'properties/AddProperty',
    'taxes/TaxAssessment', 'taxes/TaxCalculator',
    'payments/PaymentGateway', 'payments/PaymentHistory', 'payments/Receipt',
    'finance/RevenueExpenseTracker',
    'grievances/GrievanceList', 'grievances/SubmitGrievance',
    'reports/FinancialAnalytics',
    'audit/AuditLogs',
    'notifications/AlertsReminders'
];

pages.forEach(page => {
    const parts = page.split('/');
    const name = parts[parts.length - 1];
    const dir = path.join(__dirname, 'src', 'pages', ...parts.slice(0, -1));

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const fileInfo = `import React from 'react';

const ${name} = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">${name}</h2>
      <p className="text-gray-600">This module is under construction.</p>
    </div>
  );
};

export default ${name};
`;

    const filePath = path.join(dir, `${name}.jsx`);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, fileInfo);
    }
});

console.log('Pages generated successfully!');
