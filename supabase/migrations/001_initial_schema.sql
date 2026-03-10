-- IMEI Insight Database Schema
-- Migration: 001_initial_schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default margin setting
INSERT INTO settings (key, value) VALUES ('margin_percent', '20')
ON CONFLICT (key) DO NOTHING;

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  api_service_id TEXT UNIQUE NOT NULL,
  api_price NUMERIC(10, 4) NOT NULL DEFAULT 0,
  sell_price NUMERIC(10, 4) NOT NULL DEFAULT 0,
  delivery_time TEXT NOT NULL DEFAULT 'Unknown',
  category TEXT NOT NULL DEFAULT 'Info',
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  imei TEXT NOT NULL,
  service_id UUID NOT NULL REFERENCES services (id) ON DELETE RESTRICT,
  api_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result JSONB,
  price NUMERIC(10, 4) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sync logs table
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_api_order_id ON orders (api_order_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services (category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services (active);

-- Updated-at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Services: publicly readable, only service role can write
CREATE POLICY "services_select_all" ON services
  FOR SELECT USING (active = TRUE);

CREATE POLICY "services_insert_service_role" ON services
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "services_update_service_role" ON services
  FOR UPDATE USING (auth.role() = 'service_role');

-- Orders: users can only see and manage their own orders
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_service_role" ON orders
  FOR UPDATE USING (auth.role() = 'service_role');

-- Settings: publicly readable
CREATE POLICY "settings_select_all" ON settings
  FOR SELECT USING (TRUE);

CREATE POLICY "settings_update_service_role" ON settings
  FOR UPDATE USING (auth.role() = 'service_role');

-- Sync logs: only service role can read/write
CREATE POLICY "sync_logs_service_role" ON sync_logs
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
