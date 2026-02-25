import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const RoleRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect based on role
        switch (user.role) {
            case 'admin': return <Navigate to="/dashboard/admin" replace />;
            case 'staff': return <Navigate to="/dashboard/staff" replace />;
            case 'citizen': return <Navigate to="/dashboard/citizen" replace />;
            default: return <Navigate to="/login" replace />;
        }
    }

    return children;
};
