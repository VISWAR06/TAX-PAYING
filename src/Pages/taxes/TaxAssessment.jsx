import { useState, useEffect } from 'react';
import { taxService } from '../../services/taxService';
import { Calculator, Search, AlertCircle, CheckCircle2 } from 'lucide-react';

const TaxAssessment = () => {
  const [taxes, setTaxes] = useState([]);
  const [search, setSearch] = useState('');
  const [assessmentYear, setAssessmentYear] = useState(new Date().getFullYear());
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadTaxes();
  }, []);

  const loadTaxes = () => {
    setTaxes(taxService.getAllTaxes());
  };

  const handleAssess = () => {
    const count = taxService.assessTaxesForYear(assessmentYear);
    if (count > 0) {
      setMessage({ type: 'success', text: `Successfully generated ${count} new tax assessments for ${assessmentYear}.` });
      loadTaxes();
    } else {
      setMessage({ type: 'info', text: `All properties are already assessed for ${assessmentYear}.` });
    }

    setTimeout(() => setMessage(null), 5000);
  };

  const filtered = taxes.filter(t =>
    t.address.toLowerCase().includes(search.toLowerCase()) ||
    t.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tax Assessment</h2>
          <p className="text-sm text-gray-500 mt-1">Generate and manage property and water taxes for citizens.</p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <select
            className="bg-gray-50 border border-gray-200 text-gray-700 rounded-md py-1.5 px-3 text-sm focus:ring-primary-500 focus:border-primary-500"
            value={assessmentYear}
            onChange={(e) => setAssessmentYear(Number(e.target.value))}
          >
            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button
            onClick={handleAssess}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-md transition-colors text-sm font-medium"
          >
            <Calculator className="w-4 h-4" />
            <span>Generate Assessments</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-3 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, Address, or Owner..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Total Records: {filtered.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax ID & Year</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property Owner & Address</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Breakdown</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(tax => (
                <tr key={tax.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{tax.id.toUpperCase()}</div>
                    <div className="text-xs text-primary-600 font-semibold bg-primary-50 inline-block px-2 py-0.5 rounded mt-1">Year {tax.year}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{tax.ownerName}</div>
                    <div className="text-sm text-gray-500 line-clamp-1 max-w-[200px]" title={tax.address}>{tax.address}</div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">
                    <div>Prop: ₹{tax.propertyTax.toLocaleString()}</div>
                    <div>Water: ₹{tax.waterTax.toLocaleString()}</div>
                    {tax.penalty > 0 && <div className="text-red-500">Pen (+10%): ₹{tax.penalty.toLocaleString()}</div>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-lg font-bold text-gray-900">₹{(tax.propertyTax + tax.waterTax + tax.penalty).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Due: {tax.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${tax.status === 'paid'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                      {tax.status === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No tax records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaxAssessment;
