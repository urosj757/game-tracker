CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  platform TEXT,
  status TEXT NOT NULL DEFAULT 'backlog',
  rating INTEGER,
  hours_played NUMERIC DEFAULT 0,
  notes TEXT,
  added_at TIMESTAMP DEFAULT NOW()
);