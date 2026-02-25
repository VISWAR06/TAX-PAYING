import { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import { taxService } from '../../services/taxService';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Download, Filter, TrendingUp, Users, Building2, Droplets } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const FinancialAnalytics = () => {
  const [reportType, setReportType] = useState('revenue');
  const [monthlyData, setMonthlyData] = useState([]);
  const [taxData, setTaxData] = useState([]);
  const [stats, setStats] = useState({ totalCollections: 0, pendingDues: 0, propertyCount: 0 });

  useEffect(() => {
    // Load mock data
    setMonthlyData(financeService.getMonthlyData());

    // Calculate tax collection ratio
    const allTaxes = taxService.getAllTaxes();
    let propTax = 0, waterTax = 0, penalties = 0;
    let pending = 0;

    allTaxes.forEach(t => {
      if (t.status === 'paid') {
        propTax += t.propertyTax;
        waterTax += t.waterTax;
        penalties += t.penalty;
      } else {
        pending += t.total;
      }
    });

    setTaxData([
      { name: 'Property Tax', value: propTax },
      { name: 'Water & Sanitation', value: waterTax },
      { name: 'Penalties & Fees', value: penalties },
    ]);

    setStats({
      totalCollections: propTax + waterTax + penalties,
      pendingDues: pending,
      propertyCount: taxService.getAllTaxes().length
    });

  }, []);

  const formatCurrency = (val) => `₹${val.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Financial Analytics & Reports</h2>
          <p className="text-sm text-gray-500 mt-1">Deep dive into municipal revenue streams and collection metrics.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Tax Collected</p>
            <h4 className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalCollections)}</h4>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-50 rounded-lg text-red-600">
            <TrendingUp className="w-6 h-6 transform rotate-180" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Outstanding Dues</p>
            <h4 className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(stats.pendingDues)}</h4>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assessed Properties</p>
            <h4 className="text-xl font-bold text-gray-900 mt-1">{stats.propertyCount}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flexjustify-between items-center border-b border-gray-100 pb-4 mb-6">
            <h3 className="font-semibold text-gray-800">Revenue Growth (YTD)</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [formatCurrency(value)]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Expense" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-6">Collection by Category</h3>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taxData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {taxData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="absolute -bottom-4 left-0 right-0 flex flex-col space-y-2 px-2">
              {taxData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-gray-600 font-medium">{entry.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {Math.round((entry.value / stats.totalCollections) * 100 || 0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
