import { useState, useEffect } from 'react';
import { taxService } from '../../services/taxService';
import { grievanceService } from '../../services/grievanceService';
import { propertyService } from '../../services/propertyService';
import { Users, FileText, CheckCircle, Clock, Building2, Calculator, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalProps: 0, pendingTaxesCount: 0, unresolvedGrievances: 0 });

  useEffect(() => {
    const props = propertyService.getAllProperties();
    const taxes = taxService.getAllTaxes();
    const grievances = grievanceService.getAllGrievances();

    setStats({
      totalProps: props.length,
      pendingTaxesCount: taxes.filter(t => t.status === 'unpaid').length,
      unresolvedGrievances: grievances.filter(g => g.status !== 'resolved').length
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Staff Operations Center</h2>
          <p className="text-blue-100 max-w-lg">Welcome back, {user?.name}. Manage municipal assessments, oversee pending property verifications, and resolve citizen issues.</p>
        </div>
        <ShieldCheck className="absolute right-8 -bottom-8 w-48 h-48 text-white opacity-10 transform -rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-500 uppercase tracking-wider text-sm">Total Properties</h3>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 mt-4">{stats.totalProps}</p>
          <button onClick={() => navigate('/properties')} className="mt-6 w-full py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors">
            Manage Register
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-500 uppercase tracking-wider text-sm">Pending Assessments</h3>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 mt-4">{stats.pendingTaxesCount}</p>
          <button onClick={() => navigate('/assess-tax')} className="mt-6 w-full py-2.5 bg-orange-50 text-orange-700 font-semibold rounded-lg hover:bg-orange-100 transition-colors">
            Assess Taxes
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-500 uppercase tracking-wider text-sm">Active Grievances</h3>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 mt-4">{stats.unresolvedGrievances}</p>
          <button onClick={() => navigate('/grievances')} className="mt-6 w-full py-2.5 bg-red-50 text-red-700 font-semibold rounded-lg hover:bg-red-100 transition-colors">
            Resolve Complaints
          </button>
        </div>
      </div>

      <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-5">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">System is Ready for Duty</h3>
        <p className="text-gray-500 max-w-lg mx-auto mt-3 text-lg">Use the action buttons above or the sidebar links to navigate through your daily tasks, assess taxes for unassessed properties, and resolve citizen grievances.</p>
      </div>
    </div>
  );
};

export default StaffDashboard;
