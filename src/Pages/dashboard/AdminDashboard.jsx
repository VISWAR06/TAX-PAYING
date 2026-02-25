import { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import { taxService } from '../../services/taxService';
import { Shield, TrendingUp, Users, PieChart as PieChartIcon, Activity, Database, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../mockData/db';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, collectedRatio: 0, users: 0, systemHealth: 'Optimal' });

  useEffect(() => {
    const sum = financeService.getSummary();
    const taxes = taxService.getAllTaxes();

    let paidTaxes = 0;
    let totalTaxes = 0;
    taxes.forEach(t => {
      totalTaxes += t.total;
      if (t.status === 'paid') paidTaxes += t.total;
    });

    setStats({
      revenue: sum.revenue,
      collectedRatio: totalTaxes > 0 ? (paidTaxes / totalTaxes) * 100 : 0,
      paidTaxes,
      unpaidTaxes: totalTaxes - paidTaxes,
      users: db.data.users.length,
      systemHealth: '100% Uptime'
    });
  }, []);

  const data = [
    { name: 'Collected', value: stats.paidTaxes || 0 },
    { name: 'Pending', value: stats.unpaidTaxes || 0 },
  ];
  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Master Administration</h2>
            <p className="text-gray-400 max-w-lg">Executive overview of municipal operations, treasury metrics, and complete system audit logs.</p>
          </div>
          <button onClick={() => navigate('/reports')} className="hidden md:flex bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg font-bold transition-colors items-center shadow-lg border border-primary-500/50">
            <PieChartIcon className="w-5 h-5 mr-3" /> Full Analytics Report
          </button>
        </div>
        <Database className="absolute right-8 -bottom-8 w-48 h-48 text-white opacity-5 transform -rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Treasury Revenue</p>
                <p className="text-4xl font-black text-gray-900 mt-2">₹{stats.revenue.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-green-50 text-green-600 rounded-xl">
                <TrendingUp className="w-7 h-7" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">+12.5% YoY Growth</span>
              <button onClick={() => navigate('/finance')} className="text-sm font-semibold text-primary-600 hover:text-primary-700">View Ledger</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total System Users</p>
                <p className="text-4xl font-black text-gray-900 mt-2">{stats.users}</p>
              </div>
              <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-7 h-7" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full flex items-center"><Activity className="w-3 h-3 mr-1" /> Active</span>
              <button onClick={() => navigate('/users')} className="text-sm font-semibold text-primary-600 hover:text-primary-700">Manage Users</button>
            </div>
          </div>

          {/* Quick Actions Base */}
          <div className="col-span-1 border border-red-100 bg-red-50/30 rounded-2xl p-6 hover:bg-red-50 cursor-pointer transition-colors shadow-sm" onClick={() => navigate('/audit')}>
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4 text-red-600">
              <Shield className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-gray-900 text-xl">System Audit Logs</h4>
            <p className="text-sm text-gray-600 mt-2 font-medium">Review all encrypted transactions and structural state changes for supreme compliance.</p>
          </div>

          <div className="col-span-1 border border-orange-100 bg-orange-50/30 rounded-2xl p-6 hover:bg-orange-50 cursor-pointer transition-colors shadow-sm" onClick={() => navigate('/finance')}>
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 text-orange-600">
              <Database className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-gray-900 text-xl">Manage Treasury</h4>
            <p className="text-sm text-gray-600 mt-2 font-medium">Log municipal expenses, update funding configurations, and track the main balance.</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-6 flex flex-col text-white relative overflow-hidden h-full min-h-[400px]">
          <h3 className="font-bold text-gray-200 uppercase tracking-widest text-sm border-b border-gray-800 pb-4 mb-4 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" /> Tax Target Adherence
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none mt-2">
              <span className="text-4xl font-black text-white">{stats.collectedRatio.toFixed(0)}%</span>
              <span className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Collected</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center text-green-400"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Paid Base</div>
            <div className="flex items-center text-red-400"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Defaulted</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
