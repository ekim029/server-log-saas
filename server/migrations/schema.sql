-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Logs table
CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  level VARCHAR(50) NOT NULL,
  ts TIMESTAMP DEFAULT NOW(),
  source VARCHAR(50) NOT NULL DEFAULT 'local',
  metadata JSONB DEFAULT '{}'::jsonb,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);
