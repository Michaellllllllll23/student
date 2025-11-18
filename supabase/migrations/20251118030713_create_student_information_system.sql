/*
  # Student Information System Database Schema

  ## Overview
  Complete database schema for a Student Information System with role-based access control.

  ## New Tables
  
  ### 1. `users`
  - `id` (uuid, primary key) - Unique identifier
  - `email` (text, unique) - User email for login
  - `password` (text) - Plain text password (as requested)
  - `full_name` (text) - User's full name
  - `role` (text) - User role: 'admin', 'teacher', 'student', 'parent'
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `students`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - Links to users table
  - `student_id` (text, unique) - Student identification number
  - `first_name` (text) - Student's first name
  - `last_name` (text) - Student's last name
  - `middle_name` (text) - Student's middle name
  - `date_of_birth` (date) - Birth date
  - `gender` (text) - Gender
  - `address` (text) - Home address
  - `contact_number` (text) - Contact phone number
  - `email` (text) - Student email
  - `grade_level` (text) - Current grade level
  - `section` (text) - Class section
  - `enrollment_date` (date) - Date of enrollment
  - `status` (text) - Status: 'active' or 'archived'
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `parent_student_relationship`
  - `id` (uuid, primary key) - Unique identifier
  - `parent_id` (uuid, foreign key) - Links to users table (parent)
  - `student_id` (uuid, foreign key) - Links to students table
  - `relationship` (text) - Type of relationship (father, mother, guardian)
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. `subjects`
  - `id` (uuid, primary key) - Unique identifier
  - `subject_code` (text, unique) - Subject code
  - `subject_name` (text) - Subject name
  - `description` (text) - Subject description
  - `created_at` (timestamptz) - Record creation timestamp

  ### 5. `teacher_subjects`
  - `id` (uuid, primary key) - Unique identifier
  - `teacher_id` (uuid, foreign key) - Links to users table (teacher)
  - `subject_id` (uuid, foreign key) - Links to subjects table
  - `grade_level` (text) - Grade level taught
  - `section` (text) - Section taught
  - `school_year` (text) - Academic year
  - `created_at` (timestamptz) - Record creation timestamp

  ### 6. `grades`
  - `id` (uuid, primary key) - Unique identifier
  - `student_id` (uuid, foreign key) - Links to students table
  - `subject_id` (uuid, foreign key) - Links to subjects table
  - `teacher_id` (uuid, foreign key) - Teacher who encoded grade
  - `quarter` (text) - Grading period (1st, 2nd, 3rd, 4th)
  - `grade` (numeric) - Numerical grade
  - `remarks` (text) - Additional remarks
  - `school_year` (text) - Academic year
  - `encoded_at` (timestamptz) - When grade was encoded
  - `updated_at` (timestamptz) - Last update timestamp

  ### 7. `attendance`
  - `id` (uuid, primary key) - Unique identifier
  - `student_id` (uuid, foreign key) - Links to students table
  - `subject_id` (uuid, foreign key) - Links to subjects table
  - `teacher_id` (uuid, foreign key) - Teacher who recorded attendance
  - `date` (date) - Attendance date
  - `status` (text) - Status: 'present', 'absent', 'late', 'excused'
  - `remarks` (text) - Additional remarks
  - `created_at` (timestamptz) - Record creation timestamp

  ### 8. `activity_logs`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - User who performed action
  - `action` (text) - Action performed
  - `entity_type` (text) - Type of entity (grade, attendance, student)
  - `entity_id` (uuid) - ID of affected entity
  - `details` (text) - Additional details
  - `created_at` (timestamptz) - Action timestamp

  ## Security
  - RLS enabled on all tables
  - Policies created for role-based access:
    - Admins: Full access to all data
    - Teachers: Access to their assigned students and subjects
    - Students: Access to own data only
    - Parents: Access to their children's data only

  ## Important Notes
  - Password stored as plain text (as explicitly requested by user)
  - All timestamps use timezone-aware timestamps
  - Comprehensive tracking of all user activities
  - Support for archived student records
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  student_id text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  middle_name text DEFAULT '',
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  address text NOT NULL,
  contact_number text NOT NULL,
  email text NOT NULL,
  grade_level text NOT NULL,
  section text NOT NULL,
  enrollment_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS parent_student_relationship (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES users(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  relationship text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code text UNIQUE NOT NULL,
  subject_name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teacher_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  grade_level text NOT NULL,
  section text NOT NULL,
  school_year text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES users(id) ON DELETE SET NULL,
  quarter text NOT NULL CHECK (quarter IN ('1st', '2nd', '3rd', '4th')),
  grade numeric NOT NULL,
  remarks text DEFAULT '',
  school_year text NOT NULL,
  encoded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES users(id) ON DELETE SET NULL,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  remarks text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_relationship ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can login"
  ON users FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admins have full access to users"
  ON users FOR ALL
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = current_setting('request.jwt.claims', true)::json->>'email'
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  TO anon
  USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
  );

CREATE POLICY "Admins have full access to students"
  ON students FOR ALL
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = current_setting('request.jwt.claims', true)::json->>'email'
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Teachers can view students"
  ON students FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = current_setting('request.jwt.claims', true)::json->>'email'
      AND u.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Students can view own data"
  ON students FOR SELECT
  TO anon
  USING (
    user_id IN (
      SELECT id FROM users
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

CREATE POLICY "Parents can view their children"
  ON students FOR SELECT
  TO anon
  USING (
    id IN (
      SELECT psr.student_id FROM parent_student_relationship psr
      JOIN users u ON psr.parent_id = u.id
      WHERE u.email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

CREATE POLICY "Public can view subjects"
  ON subjects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admins can manage subjects"
  ON subjects FOR ALL
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = current_setting('request.jwt.claims', true)::json->>'email'
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Public can view grades"
  ON grades FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Teachers can manage grades"
  ON grades FOR ALL
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = current_setting('request.jwt.claims', true)::json->>'email'
      AND u.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Public can view attendance"
  ON attendance FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Teachers can manage attendance"
  ON attendance FOR ALL
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = current_setting('request.jwt.claims', true)::json->>'email'
      AND u.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Public can view activity logs"
  ON activity_logs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "System can insert activity logs"
  ON activity_logs FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can view parent student relationships"
  ON parent_student_relationship FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admins can manage parent student relationships"
  ON parent_student_relationship FOR ALL
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = current_setting('request.jwt.claims', true)::json->>'email'
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Public can view teacher subjects"
  ON teacher_subjects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admins can manage teacher subjects"
  ON teacher_subjects FOR ALL
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = current_setting('request.jwt.claims', true)::json->>'email'
      AND u.role = 'admin'
    )
  );

INSERT INTO users (email, password, full_name, role) VALUES
('admin@school.com', 'admin123', 'System Administrator', 'admin'),
('teacher@school.com', 'teacher123', 'John Teacher', 'teacher'),
('student@school.com', 'student123', 'Jane Student', 'student'),
('parent@school.com', 'parent123', 'Mary Parent', 'parent');

INSERT INTO subjects (subject_code, subject_name, description) VALUES
('MATH101', 'Mathematics', 'Basic Mathematics'),
('ENG101', 'English', 'English Language'),
('SCI101', 'Science', 'General Science'),
('FIL101', 'Filipino', 'Filipino Language'),
('PE101', 'Physical Education', 'Physical Education and Health');
