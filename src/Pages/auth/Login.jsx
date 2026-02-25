import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Building2, User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin': return navigate('/dashboard/admin');
        case 'staff': return navigate('/dashboard/staff');
        case 'citizen': return navigate('/dashboard/citizen');
        default: return navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const loggedInUser = login(email, password);
    if (loggedInUser) {
      switch (loggedInUser.role) {
        case 'admin': navigate('/dashboard/admin'); break;
        case 'staff': navigate('/dashboard/staff'); break;
        case 'citizen': navigate('/dashboard/citizen'); break;
        default: navigate('/');
      }
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01]">
        <div className="bg-primary-600 p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Building2 className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">MuniTax</h2>
          <p className="text-primary-100 text-sm">Municipal Tax Management System</p>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Welcome Back</h3>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="admin@municipal.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 group"
            >
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-center text-gray-500">
            <p>Demo Credentials:</p>
            <p>Admin: admin@municipal.gov / password</p>
            <p>Staff: staff@municipal.gov / password</p>
            <p>Citizen: citizen@example.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
