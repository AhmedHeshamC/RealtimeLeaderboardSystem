import pool from '../db';

export const submitScore = async (userId: number, gameId: number, score: number) => {
  const result = await pool.query(
    'INSERT INTO scores (user_id, game_id, score, submitted_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
    [userId, gameId, score]
  );
  return result.rows[0];
};

export const getUserScoreHistory = async (userId: number) => {
  const result = await pool.query(
    `SELECT s.*, g.name as game_name FROM scores s
     JOIN games g ON s.game_id = g.id
     WHERE s.user_id = $1
     ORDER BY s.submitted_at DESC`,
    [userId]
  );
  return result.rows;
};
