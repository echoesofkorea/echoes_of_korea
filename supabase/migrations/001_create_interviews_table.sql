-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  interviewee_name TEXT NOT NULL,
  interviewee_birth_year INT4,
  interview_date DATE,
  title TEXT NOT NULL,
  audio_file_path TEXT,
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  stt_status TEXT DEFAULT 'not_started' NOT NULL CHECK (stt_status IN ('not_started', 'processing', 'completed', 'failed')),
  full_transcript TEXT,
  llm_summary TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_interviews_created_at ON interviews(created_at DESC);
CREATE INDEX idx_interviews_is_published ON interviews(is_published);
CREATE INDEX idx_interviews_stt_status ON interviews(stt_status);

-- Enable Row Level Security (RLS)
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admin only)
CREATE POLICY "Admin users can view all interviews" 
  ON interviews FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin users can insert interviews" 
  ON interviews FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin users can update interviews" 
  ON interviews FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin users can delete interviews" 
  ON interviews FOR DELETE 
  USING (auth.role() = 'authenticated');