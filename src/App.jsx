import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RoleRoute } from './components/RouteGuards/RoleRoute';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Auth
import Login from './Pages/auth/Login';
import Register from './Pages/auth/Register';

// Dashboards
import AdminDashboard from './Pages/dashboard/AdminDashboard';
import CitizenDashboard from './Pages/dashboard/CitizenDashboard';
import StaffDashboard from './Pages/dashboard/StaffDashboard';

// Other Pages
import Finance from './Pages/finance/RevenueExpenseTracker';
import Reports from './Pages/reports/FinancialAnalytics';
import Audit from './Pages/audit/AuditLogs';

import PropertyList from './Pages/properties/PropertyList';
import AddProperty from './Pages/properties/AddProperty';
import TaxAssessment from './Pages/taxes/TaxAssessment';
import GrievanceList from './Pages/grievances/GrievanceList';

import PaymentGateway from './Pages/payments/PaymentGateway';
import Receipt from './Pages/payments/Receipt';
import SubmitGrievance from './Pages/grievances/SubmitGrievance';
import AlertsReminders from './Pages/notifications/AlertsReminders';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RoleRoute allowedRoles={[]}><div /></RoleRoute>} />

          {/* Protected Routes Wrapper */}
          <Route element={<AppLayout />}>
            {/* Admin Routes */}
            <Route path="/dashboard/admin" element={<RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute>} />
            <Route path="/finance" element={<RoleRoute allowedRoles={['admin']}><Finance /></RoleRoute>} />
            <Route path="/users" element={<RoleRoute allowedRoles={['admin']}><div className="p-6">User Management Scaffold</div></RoleRoute>} />
            <Route path="/reports" element={<RoleRoute allowedRoles={['admin', 'staff']}><Reports /></RoleRoute>} />
            <Route path="/audit" element={<RoleRoute allowedRoles={['admin']}><Audit /></RoleRoute>} />

            {/* Staff Routes */}
            <Route path="/dashboard/staff" element={<RoleRoute allowedRoles={['staff']}><StaffDashboard /></RoleRoute>} />
            <Route path="/properties" element={<RoleRoute allowedRoles={['admin', 'staff']}><PropertyList /></RoleRoute>} />
            <Route path="/properties/add" element={<RoleRoute allowedRoles={['admin', 'staff', 'citizen']}><AddProperty /></RoleRoute>} />
            <Route path="/assess-tax" element={<RoleRoute allowedRoles={['staff']}><TaxAssessment /></RoleRoute>} />
            <Route path="/grievances" element={<RoleRoute allowedRoles={['admin', 'staff']}><GrievanceList /></RoleRoute>} />

            {/* Citizen Routes */}
            <Route path="/dashboard/citizen" element={<RoleRoute allowedRoles={['citizen']}><CitizenDashboard /></RoleRoute>} />
            <Route path="/my-properties" element={<RoleRoute allowedRoles={['citizen']}><PropertyList /></RoleRoute>} />
            <Route path="/pay-tax" element={<RoleRoute allowedRoles={['citizen']}><PaymentGateway /></RoleRoute>} />
            <Route path="/my-receipts" element={<RoleRoute allowedRoles={['citizen']}><Receipt /></RoleRoute>} />
            <Route path="/grievances/new" element={<RoleRoute allowedRoles={['citizen']}><SubmitGrievance /></RoleRoute>} />

            {/* Shared Route */}
            <Route path="/notifications" element={<AlertsReminders />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
