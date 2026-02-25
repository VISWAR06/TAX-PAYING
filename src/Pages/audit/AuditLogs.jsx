import { useState, useEffect } from 'react';
import { db } from '../../mockData/db';
import { Shield, Search, Terminal, Filter } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    // Sort descending by timestamp
    const sortedLogs = [...db.data.auditLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setLogs(sortedLogs);
  }, []);

  const actions = ['ALL', ...new Set(logs.map(log => log.action))];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = JSON.stringify(log).toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterAction === 'ALL' || log.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-red-600" />
            System Audit Logs
          </h2>
          <p className="text-sm text-gray-500 mt-1">Immutable record of all system-level transactions and state changes.</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden text-gray-300">
        <div className="p-4 border-b border-gray-800 bg-gray-950 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search logs by ID, user, or JSON data..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-200 placeholder-gray-600"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              className="text-sm bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 focus:ring-1 focus:ring-red-500 focus:border-red-500 text-gray-200"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              {actions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800 text-gray-500 uppercase tracking-wider text-xs">
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">User / Entity</th>
                <th className="px-6 py-4 font-semibold w-1/3">Raw Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 font-mono text-xs">
              {filteredLogs.map(log => {
                const { id, action, timestamp, ...payload } = log;
                return (
                  <tr key={id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                      {new Date(timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-red-900/30 text-red-400 border border-red-900/50 px-2 py-1 rounded font-bold">
                        {action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-400">
                      {payload.userId || payload.propertyId || payload.taxId || 'SYSTEM'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-gray-950 p-2 rounded overflow-x-auto text-green-500 border border-gray-800">
                        {JSON.stringify(payload)}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-600">
                    <Terminal className="w-12 h-12 mx-auto text-gray-800 mb-4" />
                    No logs maching the criteria.
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

export default AuditLogs;
