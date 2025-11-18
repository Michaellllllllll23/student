import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { getAllStudents, getAllSubjects } from '../../lib/api';
import { supabase } from '../../lib/supabase';

export default function Reports() {
  const [reportType, setReportType] = useState<'grades' | 'attendance' | 'students'>('students');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);

  useEffect(() => {
    loadReport();
  }, [reportType]);

  const loadReport = async () => {
    setLoading(true);
    try {
      if (reportType === 'students') {
        const students = await getAllStudents();
        setReportData(students.filter(s => s.status === 'active'));
      } else if (reportType === 'grades') {
        const { data } = await supabase
          .from('grades')
          .select('*, students(*), subjects(*)')
          .order('encoded_at', { ascending: false });
        setReportData(data || []);
      } else if (reportType === 'attendance') {
        const { data } = await supabase
          .from('attendance')
          .select('*, students(*), subjects(*)')
          .order('date', { ascending: false })
          .limit(100);
        setReportData(data || []);
      }
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    let csv = '';
    let filename = '';

    if (reportType === 'students') {
      csv = 'Student ID,Name,Email,Grade,Section,Status\n';
      reportData.forEach((s: any) => {
        csv += `${s.student_id},"${s.first_name} ${s.last_name}",${s.email},${s.grade_level},${s.section},${s.status}\n`;
      });
      filename = 'students_report.csv';
    } else if (reportType === 'grades') {
      csv = 'Student,Subject,Quarter,Grade,School Year\n';
      reportData.forEach((g: any) => {
        csv += `"${g.students?.first_name} ${g.students?.last_name}",${g.subjects?.subject_name},${g.quarter},${g.grade},${g.school_year}\n`;
      });
      filename = 'grades_report.csv';
    } else if (reportType === 'attendance') {
      csv = 'Student,Subject,Date,Status\n';
      reportData.forEach((a: any) => {
        csv += `"${a.students?.first_name} ${a.students?.last_name}",${a.subjects?.subject_name},${a.date},${a.status}\n`;
      });
      filename = 'attendance_report.csv';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
        <button
          onClick={downloadCSV}
          disabled={reportData.length === 0}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          <span>Download CSV</span>
        </button>
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setReportType('students')}
          className={`px-4 py-2 rounded-lg transition ${
            reportType === 'students'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setReportType('grades')}
          className={`px-4 py-2 rounded-lg transition ${
            reportType === 'grades'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Grades
        </button>
        <button
          onClick={() => setReportType('attendance')}
          className={`px-4 py-2 rounded-lg transition ${
            reportType === 'attendance'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Attendance
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading report...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {reportType === 'students' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Grade/Section
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((student: any) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.student_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.grade_level} - {student.section}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'grades' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quarter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    School Year
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((grade: any) => (
                  <tr key={grade.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {grade.students?.first_name} {grade.students?.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {grade.subjects?.subject_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{grade.quarter}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{grade.grade}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{grade.school_year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'attendance' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((attendance: any) => (
                  <tr key={attendance.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {attendance.students?.first_name} {attendance.students?.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {attendance.subjects?.subject_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{attendance.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          attendance.status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : attendance.status === 'late'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {attendance.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportData.length === 0 && (
            <div className="text-center py-12 text-gray-500">No data available</div>
          )}
        </div>
      )}
    </div>
  );
}
