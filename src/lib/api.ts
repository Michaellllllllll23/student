import { supabase, User, Student, Grade, Attendance, ActivityLog } from './supabase';

export async function login(email: string, password: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Invalid credentials');

  return data as User;
}

export async function logActivity(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  details: string
) {
  await supabase.from('activity_logs').insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  });
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as User[];
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function updateUser(id: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function deleteUser(id: string) {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
}

export async function getAllStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Student[];
}

export async function getStudentById(id: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Student;
}

export async function createStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('students')
    .insert(student)
    .select()
    .single();

  if (error) throw error;
  return data as Student;
}

export async function updateStudent(id: string, updates: Partial<Student>) {
  const { data, error } = await supabase
    .from('students')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Student;
}

export async function deleteStudent(id: string) {
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw error;
}

export async function archiveStudent(id: string) {
  return updateStudent(id, { status: 'archived' });
}

export async function getAllSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('subject_name');

  if (error) throw error;
  return data;
}

export async function getGradesByStudent(studentId: string) {
  const { data, error } = await supabase
    .from('grades')
    .select('*, subjects(*), users!grades_teacher_id_fkey(*)')
    .eq('student_id', studentId)
    .order('encoded_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createGrade(grade: Omit<Grade, 'id' | 'encoded_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('grades')
    .insert(grade)
    .select()
    .single();

  if (error) throw error;
  return data as Grade;
}

export async function updateGrade(id: string, updates: Partial<Grade>) {
  const { data, error } = await supabase
    .from('grades')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Grade;
}

export async function getAttendanceByStudent(studentId: string) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*, subjects(*), users!attendance_teacher_id_fkey(*)')
    .eq('student_id', studentId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createAttendance(attendance: Omit<Attendance, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('attendance')
    .insert(attendance)
    .select()
    .single();

  if (error) throw error;
  return data as Attendance;
}

export async function getActivityLogs() {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*, users(*)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data;
}

export async function getParentChildren(parentId: string) {
  const { data, error } = await supabase
    .from('parent_student_relationship')
    .select('*, students(*)')
    .eq('parent_id', parentId);

  if (error) throw error;
  return data;
}

export async function createParentStudentRelationship(
  parentId: string,
  studentId: string,
  relationship: string
) {
  const { data, error } = await supabase
    .from('parent_student_relationship')
    .insert({ parent_id: parentId, student_id: studentId, relationship })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getStudentUser(studentId: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*, users(*)')
    .eq('id', studentId)
    .single();

  if (error) throw error;
  return data;
}
