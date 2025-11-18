import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { getActivityLogs } from '../../lib/api';

export default function ActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await getActivityLogs();
      setLogs(data);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Activity className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Activity Logs</h2>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading logs...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {log.users?.full_name || 'Unknown User'}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        log.action === 'create'
                          ? 'bg-green-100 text-green-800'
                          : log.action === 'update'
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'delete'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="text-sm text-gray-600">{log.entity_type}</span>
                  </div>
                  <p className="text-gray-700">{log.details}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center py-12 text-gray-500">No activity logs found</div>
          )}
        </div>
      )}
    </div>
  );
}
