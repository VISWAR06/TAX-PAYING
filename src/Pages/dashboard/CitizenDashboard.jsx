import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { taxService } from '../../services/taxService';
import { grievanceService } from '../../services/grievanceService';
import { propertyService } from '../../services/propertyService';
import { Building2, Calculator, Receipt, MessageSquare, AlertTriangle, ArrowRight, Home, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ properties: 0, pendingTaxes: 0, activeGrievances: 0 });
  const [recentGrievances, setRecentGrievances] = useState([]);
  const [pendingTaxesList, setPendingTaxesList] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      const properties = propertyService.getPropertiesByOwner(user.id);
      const taxes = taxService.getTaxesByUser(user.id);
      const grievances = grievanceService.getGrievancesByUser(user.id);

      const unpaidTaxes = taxes.filter(t => t.status === 'unpaid');

      setStats({
        properties: properties.length,
        pendingTaxes: unpaidTaxes.reduce((sum, t) => sum + t.total, 0),
        activeGrievances: grievances.filter(g => g.status !== 'resolved').length
      });

      setPendingTaxesList(unpaidTaxes.slice(0, 3));
      setRecentGrievances(grievances.slice(0, 4));
    }
  }, [user]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Citizen'}</h2>
          <p className="text-primary-100 max-w-lg">Manage your municipal properties, pay pending taxes seamlessly, and track your service requests all from one place.</p>
        </div>
        <Home className="absolute right-8 -bottom-8 w-48 h-48 text-white opacity-10 transform -rotate-12" />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/my-properties')}>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">My Properties</p>
            <h4 className="text-3xl font-black text-gray-900">{stats.properties}</h4>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Building2 className="w-7 h-7" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/pay-tax')}>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Pending Dues</p>
            <h4 className="text-3xl font-black text-red-600">₹{stats.pendingTaxes.toLocaleString()}</h4>
          </div>
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <Calculator className="w-7 h-7" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/grievances/new')}>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Active Complaints</p>
            <h4 className="text-3xl font-black text-orange-600">{stats.activeGrievances}</h4>
          </div>
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-7 h-7" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Required: Taxes */}
        <div className="bg-white rounded-xl shadow-sm border border-red-100 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-red-100 bg-red-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-red-900 flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" /> Action Required: Unpaid Taxes
            </h3>
            <button onClick={() => navigate('/pay-tax')} className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center">
            {pendingTaxesList.length > 0 ? (
              <div className="space-y-4">
                {pendingTaxesList.map(tax => (
                  <div key={tax.id} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-red-200 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1">{tax.address}</p>
                      <p className="text-xs text-red-600 mt-1 font-semibold flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Due: {tax.dueDate}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-black text-lg text-gray-900">₹{tax.total.toLocaleString()}</p>
                      <button onClick={() => navigate('/pay-tax')} className="text-xs mt-1 bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-lg font-semibold text-gray-800">No pending tax payments!</p>
                <p className="text-sm text-gray-500 mt-1">Thank you for being a responsible citizen.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Grievances */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-semibold text-gray-800">Recent Complaints</h3>
            <button onClick={() => navigate('/grievances/new')} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center">
              Submit New <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="p-5 flex-1">
            {recentGrievances.length > 0 ? (
              <div className="space-y-4">
                {recentGrievances.map(g => (
                  <div key={g.id} className="flex justify-between items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">{g.title}</p>
                      <p className="text-xs text-gray-500">{new Date(g.dateSubmitted).toDateString()}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${g.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      g.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                      {g.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-800">No complaints submitted</p>
                <p className="text-sm text-gray-500 mt-1">If you face any issues, raise a request here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
