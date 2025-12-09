-- NorChain PM Dashboard Database Schema
-- Run this migration in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PHASES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS phases (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  focus TEXT NOT NULL,
  duration TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'complete')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- DELIVERABLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase_id INTEGER NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'complete')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  role TEXT NOT NULL CHECK (role IN ('blockchain', 'contract', 'backend', 'frontend', 'mobile-ios', 'mobile-android', 'devops')),
  phase_id INTEGER NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  complexity TEXT NOT NULL DEFAULT 'medium' CHECK (complexity IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'review', 'done')),
  assignee TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- REPOSITORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS repositories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  url TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  category TEXT NOT NULL,
  phase_id INTEGER REFERENCES phases(id) ON DELETE SET NULL,
  default_branch TEXT DEFAULT 'main',
  language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  last_commit_at TIMESTAMPTZ,
  health TEXT DEFAULT 'healthy' CHECK (health IN ('healthy', 'warning', 'critical')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TOKENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('utility', 'security')),
  tradability TEXT NOT NULL CHECK (tradability IN ('public', 'private')),
  kyc_required BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- COMPLIANCE ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS compliance_items (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  item TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'complete')),
  required BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ACTIVITY LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('commit', 'issue', 'pr', 'release', 'milestone', 'task_update', 'phase_update', 'compliance_update')),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT,
  author_avatar TEXT,
  url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tasks_phase_id ON tasks(phase_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_role ON tasks(role);
CREATE INDEX IF NOT EXISTS idx_deliverables_phase_id ON deliverables(phase_id);
CREATE INDEX IF NOT EXISTS idx_repositories_category ON repositories(category);
CREATE INDEX IF NOT EXISTS idx_compliance_items_status ON compliance_items(status);
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON activity_log(type);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- ============================================
-- UPDATE TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER phases_updated_at
  BEFORE UPDATE ON phases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER deliverables_updated_at
  BEFORE UPDATE ON deliverables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER repositories_updated_at
  BEFORE UPDATE ON repositories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tokens_updated_at
  BEFORE UPDATE ON tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER compliance_items_updated_at
  BEFORE UPDATE ON compliance_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed)
CREATE POLICY "Public read access" ON phases FOR SELECT USING (true);
CREATE POLICY "Public read access" ON deliverables FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tasks FOR SELECT USING (true);
CREATE POLICY "Public read access" ON repositories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tokens FOR SELECT USING (true);
CREATE POLICY "Public read access" ON compliance_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON activity_log FOR SELECT USING (true);
CREATE POLICY "Public read access" ON settings FOR SELECT USING (true);

-- Service role can do everything (for API/MCP updates)
CREATE POLICY "Service role full access" ON phases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON deliverables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON repositories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON tokens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON compliance_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON activity_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON settings FOR ALL USING (true) WITH CHECK (true);

