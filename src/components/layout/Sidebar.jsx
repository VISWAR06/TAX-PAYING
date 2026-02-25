import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Home, Building2, Calculator, Receipt, DollarSign,
    MessageSquare, PieChart, Bell, Shield, Users, FileText
} from 'lucide-react';

export const Sidebar = () => {
    const { user } = useAuth();
    if (!user) return null;

    const role = user.role;

    const getLinks = () => {
        switch (role) {
            case 'admin':
                return [
                    { path: '/dashboard/admin', label: 'Dashboard', icon: Home },
                    { path: '/finance', label: 'Finance', icon: DollarSign },
                    { path: '/users', label: 'User Management', icon: Users },
                    { path: '/reports', label: 'Reports', icon: PieChart },
                    { path: '/audit', label: 'Audit Logs', icon: Shield },
                ];
            case 'staff':
                return [
                    { path: '/dashboard/staff', label: 'Dashboard', icon: Home },
                    { path: '/properties', label: 'All Properties', icon: Building2 },
                    { path: '/assess-tax', label: 'Tax Assessment', icon: Calculator },
                    { path: '/grievances', label: 'Grievances', icon: MessageSquare },
                ];
            case 'citizen':
                return [
                    { path: '/dashboard/citizen', label: 'Dashboard', icon: Home },
                    { path: '/my-properties', label: 'My Properties', icon: Building2 },
                    { path: '/pay-tax', label: 'Pay Tax', icon: Calculator },
                    { path: '/my-receipts', label: 'My Receipts', icon: Receipt },
                    { path: '/grievances/new', label: 'Submit Grievance', icon: MessageSquare },
                ];
            default:
                return [];
        }
    };

    const links = getLinks();

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <Building2 className="w-8 h-8 text-primary-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">MuniTax</h1>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <li key={link.path}>
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {link.label}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-200 text-xs text-center text-gray-500">
                &copy; {new Date().getFullYear()} MuniTax Portal
            </div>
        </aside>
    );
};
