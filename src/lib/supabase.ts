import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string | null;
  student_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  contact_number: string;
  email: string;
  grade_level: string;
  section: string;
  enrollment_date: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  subject_code: string;
  subject_name: string;
  description: string;
  created_at: string;
}

export interface Grade {
  id: string;
  student_id: string;
  subject_id: string;
  teacher_id: string;
  quarter: '1st' | '2nd' | '3rd' | '4th';
  grade: number;
  remarks: string;
  school_year: string;
  encoded_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  subject_id: string;
  teacher_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
}

export interface ParentStudentRelationship {
  id: string;
  parent_id: string;
  student_id: string;
  relationship: string;
  created_at: string;
}

export interface TeacherSubject {
  id: string;
  teacher_id: string;
  subject_id: string;
  grade_level: string;
  section: string;
  school_year: string;
  created_at: string;
}
