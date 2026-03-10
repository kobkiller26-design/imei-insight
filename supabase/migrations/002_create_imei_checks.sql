-- Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create imei_checks table
CREATE TABLE IF NOT EXISTS imei_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  imei TEXT NOT NULL,
  result_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for fast user history lookups
CREATE INDEX IF NOT EXISTS idx_imei_checks_user_id ON imei_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_imei_checks_created_at ON imei_checks(created_at);

-- Enable Row-Level Security
ALTER TABLE imei_checks ENABLE ROW LEVEL SECURITY;

-- Users can read only their own checks
CREATE POLICY "Users can read own imei_checks"
  ON imei_checks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert only their own checks
CREATE POLICY "Users can insert own imei_checks"
  ON imei_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);
