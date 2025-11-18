import { useState, useEffect } from 'react';
import { LogOut, Users, GraduationCap, BarChart3, UserPlus, Activity } from 'lucide-react';
import { User } from '../lib/supabase';
import StudentManagement from './admin/StudentManagement';
import UserManagement from './admin/UserManagement';
import Reports from './admin/Reports';
import ActivityLogs from './admin/ActivityLogs';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

type Tab = 'students' | 'users' | 'reports' | 'logs';

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('students');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
                <p className="text-xs text-gray-600">{user.full_name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition flex-1 justify-center ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Students</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition flex-1 justify-center ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition flex-1 justify-center ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Reports</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition flex-1 justify-center ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>Activity Logs</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'students' && <StudentManagement user={user} />}
          {activeTab === 'users' && <UserManagement user={user} />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'logs' && <ActivityLogs />}
        </div>
      </div>
    </div>
  );
}
