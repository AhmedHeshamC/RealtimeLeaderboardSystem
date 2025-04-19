-- PostgreSQL schema for Real-time Leaderboard System

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_username ON users(username);

-- Games table
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Scores table
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    submitted_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_scores_user_game ON scores(user_id, game_id);
CREATE INDEX idx_scores_game_score ON scores(game_id, score DESC);

-- NOTIFY trigger for real-time leaderboard updates
CREATE OR REPLACE FUNCTION notify_leaderboard_update() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('leaderboard_update',
    json_build_object(
      'score_id', NEW.id,
      'user_id', NEW.user_id,
      'game_id', NEW.game_id,
      'score', NEW.score,
      'submitted_at', NEW.submitted_at
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS scores_leaderboard_notify ON scores;
CREATE TRIGGER scores_leaderboard_notify
AFTER INSERT ON scores
FOR EACH ROW EXECUTE FUNCTION notify_leaderboard_update();

-- Example: You can add more tables or views for reports or materialized leaderboards as needed.
