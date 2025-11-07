-- Create all tables for Mind's Eye View website

-- Events table
CREATE TABLE IF NOT EXISTS "events" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  venue VARCHAR(255) NOT NULL,
  address TEXT,
  event_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  ticket_url VARCHAR(500),
  is_acoustic BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_event_date ON "events"(event_date);

-- Photos table
CREATE TABLE IF NOT EXISTS "photos" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  thumbnail_path VARCHAR(500),
  uploaded_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS "videos" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_url VARCHAR(500) NOT NULL,
  youtube_id VARCHAR(50) NOT NULL,
  is_acoustic BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_display_order ON "videos"(display_order);

-- Subscribers table
CREATE TABLE IF NOT EXISTS "subscribers" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT NOW()
);

-- AdminUser table (if not already exists)
CREATE TABLE IF NOT EXISTS "AdminUser" (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "lastLogin" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Show all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
