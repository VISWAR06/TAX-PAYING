import { useAuth } from '../../contexts/AuthContext';
import { Bell, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Topbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
            <div className="flex items-center">
                {/* Mobile menu button could go here */}
                <span className="text-gray-500 font-medium capitalize">
                    {user.role} Portal
                </span>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/notifications')}
                    className="p-2 rounded-full hover:bg-gray-100 relative transition-colors"
                    title="Notifications"
                >
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                        <User className="w-5 h-5" />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 ml-4 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                        title="Logout"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};
