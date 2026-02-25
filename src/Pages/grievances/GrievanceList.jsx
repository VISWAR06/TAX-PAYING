import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { grievanceService } from '../../services/grievanceService';
import { MessageSquare, Search, Filter, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const GrievanceList = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, in-progress, resolved

  // Staff response modal state
  const [respondingTo, setRespondingTo] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  useEffect(() => {
    loadGrievances();
  }, [user]);

  const loadGrievances = () => {
    if (user.role === 'citizen') {
      setGrievances(grievanceService.getGrievancesByUser(user.id));
    } else {
      setGrievances(grievanceService.getAllGrievances());
    }
  };

  const handleResolve = (e) => {
    e.preventDefault();
    if (respondingTo && resolutionText) {
      grievanceService.updateGrievanceStatus(respondingTo.id, 'resolved', resolutionText);
      setRespondingTo(null);
      setResolutionText('');
      loadGrievances();
    }
  };

  const filtered = grievances.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
      (g.citizenName && g.citizenName.toLowerCase().includes(search.toLowerCase())) ||
      g.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || g.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved': return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Resolved</span>;
      case 'in-progress': return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center"><Clock className="w-3 h-3 mr-1" /> In Progress</span>;
      case 'pending': default: return <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {user.role === 'citizen' ? 'My Grievances' : 'Grievance Management'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track, manage, and resolve citizen complaints.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              className="text-sm border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600">No complaints found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(grievance => (
              <div key={grievance.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-lg text-gray-900">{grievance.title}</h3>
                    {getStatusBadge(grievance.status)}
                  </div>
                  <span className="text-xs font-mono text-gray-400">{grievance.id.toUpperCase()}</span>
                </div>

                <p className="text-gray-600 text-sm mt-2 mb-4 whitespace-pre-line">{grievance.description}</p>

                {grievance.status === 'resolved' && grievance.resolution && (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 mt-4 mb-4">
                    <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">Resolution Details</h4>
                    <p className="text-sm text-green-700">{grievance.resolution}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span>Category: <strong className="capitalize">{grievance.category.replace('_', ' ')}</strong></span>
                    {user.role !== 'citizen' && <span>Citizen: <strong>{grievance.citizenName}</strong></span>}
                    <span>Submitted: {new Date(grievance.dateSubmitted).toLocaleDateString()}</span>
                  </div>

                  {user.role !== 'citizen' && grievance.status !== 'resolved' && (
                    <button
                      onClick={() => setRespondingTo(grievance)}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-1.5 rounded-md transition-colors"
                    >
                      Resolve Issue
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {respondingTo && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Resolve Grievance</h3>
              <button onClick={() => setRespondingTo(null)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form onSubmit={handleResolve} className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Providing a resolution for: <strong className="text-gray-900">{respondingTo.title}</strong>
              </p>
              <textarea
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe how this issue was resolved..."
                value={resolutionText}
                onChange={e => setResolutionText(e.target.value)}
              />
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setRespondingTo(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Mark as Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceList;
