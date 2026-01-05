-- STEP 1: Run this first to create all tables
-- Copy this entire block and paste into Supabase SQL Editor

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'farmer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  planted_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expected_harvest_date TIMESTAMP WITH TIME ZONE NOT NULL,
  growth_stage TEXT NOT NULL DEFAULT 'seedling',
  area REAL NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  area REAL NOT NULL,
  boundaries TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drone_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  drone_name TEXT NOT NULL,
  connection_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'connected',
  battery_level INTEGER DEFAULT 100,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plant_health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  drone_id UUID REFERENCES drone_connections(id) ON DELETE SET NULL,
  health_score INTEGER NOT NULL,
  infection_rate REAL NOT NULL,
  infection_type TEXT,
  severity TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  detection_confidence INTEGER NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pesticide_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  health_record_id UUID REFERENCES plant_health_records(id) ON DELETE SET NULL,
  pesticide_type TEXT NOT NULL,
  volume_per_hectare REAL NOT NULL,
  total_volume REAL NOT NULL,
  application_method TEXT NOT NULL DEFAULT 'drone',
  status TEXT NOT NULL DEFAULT 'recommended',
  recommended_by TEXT DEFAULT 'ai_system',
  confidence INTEGER NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  applied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crops_user_id ON crops(user_id);
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON fields(user_id);
CREATE INDEX IF NOT EXISTS idx_drone_connections_user_id ON drone_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_plant_health_records_field_id ON plant_health_records(field_id);
CREATE INDEX IF NOT EXISTS idx_pesticide_applications_field_id ON pesticide_applications(field_id);
