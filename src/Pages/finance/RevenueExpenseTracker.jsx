import { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Plus, CreditCard } from 'lucide-react';

const RevenueExpenseTracker = () => {
  const [summary, setSummary] = useState({ revenue: 0, expenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newExpense, setNewExpense] = useState({ amount: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSummary(financeService.getSummary());
    setTransactions(financeService.getTransactions());
    setChartData(financeService.getMonthlyData());
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    financeService.addExpense(newExpense.amount, newExpense.description);
    setNewExpense({ amount: '', description: '' });
    setIsAddingMode(false);
    loadData();
  };

  const formatCurrency = (amount) => `₹${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor municipal revenue, expenses, and manage ledger transactions.</p>
        </div>

        <button
          onClick={() => setIsAddingMode(!isAddingMode)}
          className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors shadow-sm font-medium
            ${isAddingMode ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-red-600 hover:bg-red-700 text-white'}`}
        >
          <Plus className={`w-5 h-5 transition-transform ${isAddingMode ? 'rotate-45' : ''}`} />
          <span>{isAddingMode ? 'Cancel' : 'Record Expense'}</span>
        </button>
      </div>

      {isAddingMode && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-6 animate-in slide-in-from-top-4">
          <h3 className="font-semibold text-red-800 mb-4 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2" />
            Record New Municipal Expense
          </h3>
          <form onSubmit={handleAddExpense} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-red-800 mb-1">Expense Description</label>
              <input
                type="text"
                required
                className="w-full border border-red-200 bg-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-400"
                placeholder="e.g. Park Maintenance / Office Supplies"
                value={newExpense.description}
                onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>
            <div className="md:w-64 w-full">
              <label className="block text-sm font-medium text-red-800 mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                min="1"
                className="w-full border border-red-200 bg-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-400 font-mono"
                placeholder="5000"
                value={newExpense.amount}
                onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </div>
            <button type="submit" className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 whitespace-nowrap w-full md:w-auto mt-4 md:mt-0 transition-colors">
              Save Expense
            </button>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center p-6 space-x-4">
          <div className="p-4 bg-green-50 rounded-full text-green-600">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(summary.revenue)}</h4>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center p-6 space-x-4">
          <div className="p-4 bg-red-50 rounded-full text-red-600">
            <TrendingDown className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Expenses</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(summary.expenses)}</h4>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center p-6 space-x-4 relative overflow-hidden">
          <DollarSign className="w-32 h-32 absolute -right-6 -bottom-6 text-white opacity-10" />
          <div className="p-4 bg-white/10 rounded-full text-white backdrop-blur-sm relative z-10">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-300">Net Surplus / Treasury</p>
            <h4 className="text-2xl font-bold text-white mt-1">{formatCurrency(summary.balance)}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart View */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-6">Income vs Expense (YTD)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dx={-10} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                  formatter={(value) => [formatCurrency(value)]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
          <div className="p-5 border-b border-gray-100 font-semibold text-gray-800 flex justify-between items-center">
            Recent Transactions
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{transactions.length} Total</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            {transactions.slice(0, 15).map(tx => (
              <div key={tx.id} className="p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between mb-1 group transition-colors">
                <div>
                  <div className="font-medium text-sm text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {tx.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(tx.date).toLocaleDateString()} • {tx.id}
                  </div>
                </div>
                <div className={`font-bold text-sm whitespace-nowrap ml-4 ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueExpenseTracker;
