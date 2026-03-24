-- Chatroom Database Schema

CREATE TABLE IF NOT EXISTS users (
  id        SERIAL PRIMARY KEY,
  username  VARCHAR(50)  UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role      VARCHAR(20)  NOT NULL DEFAULT 'user',  -- 'admin' | 'moderator' | 'user'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  room_id    INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
  content    TEXT        NOT NULL,
  deleted    BOOLEAN     DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_room_created ON messages(room_id, created_at);

-- Default rooms
INSERT INTO rooms (name) VALUES ('general'), ('random') ON CONFLICT DO NOTHING;
