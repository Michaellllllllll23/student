import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getAllStudents, getAllSubjects, createGrade, updateGrade, logActivity } from '../../lib/api';
import { User } from '../../lib/supabase';
import { supabase } from '../../lib/supabase';

interface GradeManagementProps {
  user: User;
}

export default function GradeManagement({ user }: GradeManagementProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    quarter: '1st' as '1st' | '2nd' | '3rd' | '4th',
    grade: '',
    remarks: '',
    school_year: '2024-2025',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsData, subjectsData] = await Promise.all([
        getAllStudents(),
        getAllSubjects(),
      ]);
      setStudents(studentsData.filter((s) => s.status === 'active'));
      setSubjects(subjectsData);

      const { data: gradesData } = await supabase
        .from('grades')
        .select('*, students(*), subjects(*)')
        .eq('teacher_id', user.id)
        .order('encoded_at', { ascending: false });
      setGrades(gradesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const gradeData = {
        student_id: formData.student_id,
        subject_id: formData.subject_id,
        teacher_id: user.id,
        quarter: formData.quarter,
        grade: parseFloat(formData.grade),
        remarks: formData.remarks,
        school_year: formData.school_year,
      };

      if (editingId) {
        await updateGrade(editingId, gradeData);
        await logActivity(user.id, 'update', 'grade', editingId, 'Updated grade');
      } else {
        const newGrade = await createGrade(gradeData);
        await logActivity(user.id, 'create', 'grade', newGrade.id, 'Created grade');
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        student_id: '',
        subject_id: '',
        quarter: '1st',
        grade: '',
        remarks: '',
        school_year: '2024-2025',
      });
      loadData();
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Failed to save grade');
    }
  };

  const handleEdit = (grade: any) => {
    setEditingId(grade.id);
    setFormData({
      student_id: grade.student_id,
      subject_id: grade.subject_id,
      quarter: grade.quarter,
      grade: grade.grade.toString(),
      remarks: grade.remarks,
      school_year: grade.school_year,
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {editingId ? 'Edit Grade' : 'Add Grade'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
              <select
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} - {student.student_id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={formData.subject_id}
                onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quarter</label>
              <select
                value={formData.quarter}
                onChange={(e) =>
                  setFormData({ ...formData, quarter: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="1st">1st Quarter</option>
                <option value="2nd">2nd Quarter</option>
                <option value="3rd">3rd Quarter</option>
                <option value="4th">4th Quarter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
              <input
                type="number"
                step="0.01"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Year</label>
              <input
                type="text"
                value={formData.school_year}
                onChange={(e) => setFormData({ ...formData, school_year: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <input
                type="text"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingId ? 'Update Grade' : 'Add Grade'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Grade Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add Grade</span>
        </button>
      </div>

      <div className="overflow-x-auto">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {grades.map((grade) => (
              <tr key={grade.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {grade.students?.first_name} {grade.students?.last_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {grade.subjects?.subject_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{grade.quarter}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{grade.grade}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{grade.school_year}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <button
                    onClick={() => handleEdit(grade)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {grades.length === 0 && (
          <div className="text-center py-12 text-gray-500">No grades found</div>
        )}
      </div>
    </div>
  );
}
