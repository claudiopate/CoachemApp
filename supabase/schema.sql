-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  phone TEXT,
  level TEXT,
  preferred_sport TEXT,
  preferred_days TEXT[],
  preferred_times TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  type TEXT NOT NULL,
  court TEXT,
  status TEXT NOT NULL,
  notes TEXT,
  user_id TEXT NOT NULL,
  coach_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress_records table
CREATE TABLE progress_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  skill TEXT NOT NULL,
  level INTEGER NOT NULL,
  notes TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_records ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Bookings policies
CREATE POLICY "Coaches can view their bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = coach_id);

CREATE POLICY "Students can view their bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Coaches can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = coach_id);

-- Attendance policies
CREATE POLICY "Coaches can view attendance for their bookings"
  ON attendance FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = attendance.booking_id
    AND bookings.coach_id = auth.uid()
  ));

CREATE POLICY "Coaches can insert attendance for their bookings"
  ON attendance FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = attendance.booking_id
    AND bookings.coach_id = auth.uid()
  ));

-- Progress records policies
CREATE POLICY "Coaches can view progress records for their students"
  ON progress_records FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.user_id = progress_records.user_id
    AND bookings.coach_id = auth.uid()
  ) OR auth.uid() = user_id);

CREATE POLICY "Coaches can insert progress records for their students"
  ON progress_records FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.user_id = progress_records.user_id
    AND bookings.coach_id = auth.uid()
  ));

