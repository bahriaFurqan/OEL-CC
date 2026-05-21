-- 1. Create the feedback table
CREATE TABLE feedback (
  id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message text NOT NULL,
  category text NOT NULL,
  is_reviewed bool DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Anyone can insert a new feedback row
CREATE POLICY "Anyone can submit feedback" 
ON feedback FOR INSERT 
WITH CHECK (true);

-- Only authenticated users (admin) can select/read feedback
CREATE POLICY "Only admin can view feedback" 
ON feedback FOR SELECT 
USING (auth.role() = 'authenticated');

-- Only authenticated users (admin) can update feedback
CREATE POLICY "Only admin can update feedback" 
ON feedback FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Only authenticated users (admin) can delete feedback
CREATE POLICY "Only admin can delete feedback" 
ON feedback FOR DELETE 
USING (auth.role() = 'authenticated');

-- 4. Enable Realtime for the feedback table
ALTER PUBLICATION supabase_realtime ADD TABLE feedback;
