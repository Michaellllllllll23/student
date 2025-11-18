import { useState } from 'react';
import { LogOut, GraduationCap, BookOpen, Calendar } from 'lucide-react';
import { User } from '../lib/supabase';
import GradeManagement from './teacher/GradeManagement';
import AttendanceManagement from './teacher/AttendanceManagement';
import StudentList from './teacher/StudentList';

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
}

type Tab = 'grades' | 'attendance' | 'students';

export default function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('students');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Teacher Portal</h1>
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
            <GraduationCap className="w-5 h-5" />
            <span>Students</span>
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition flex-1 justify-center ${
              activeTab === 'grades'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Grades</span>
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition flex-1 justify-center ${
              activeTab === 'attendance'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Attendance</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'students' && <StudentList user={user} />}
          {activeTab === 'grades' && <GradeManagement user={user} />}
          {activeTab === 'attendance' && <AttendanceManagement user={user} />}
        </div>
      </div>
    </div>
  );
}
