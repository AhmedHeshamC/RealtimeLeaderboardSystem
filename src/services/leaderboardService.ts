import pool from '../db';

const leaderboardService = {
  async getGlobalLeaderboard(limit = 100, offset = 0, username?: string) {
    let query = `
      SELECT u.id as user_id, u.username, SUM(s.score) as total_score
      FROM scores s
      JOIN users u ON s.user_id = u.id
    `;
    const params: any[] = [];
    if (username) {
      params.push(`%${username}%`);
      query += `WHERE u.username ILIKE $${params.length} `;
    }
    query += `GROUP BY u.id, u.username
      ORDER BY total_score DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const { rows } = await pool.query(query, params);
    return rows;
  },

  async getGameLeaderboard(gameId: string, limit = 100, offset = 0, username?: string) {
    let query = `
      SELECT u.id as user_id, u.username, MAX(s.score) as best_score
      FROM scores s
      JOIN users u ON s.user_id = u.id
      WHERE s.game_id = $1
    `;
    const params: any[] = [gameId];
    if (username) {
      params.push(`%${username}%`);
      query += `AND u.username ILIKE $${params.length} `;
    }
    query += `GROUP BY u.id, u.username
      ORDER BY best_score DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const { rows } = await pool.query(query, params);
    return rows;
  },

  async getUserRank(userId: string, gameId: string) {
    // User's rank in a specific game by best score
    const query = `
      WITH ranked AS (
        SELECT
          s.user_id,
          MAX(s.score) as best_score,
          RANK() OVER (ORDER BY MAX(s.score) DESC) as rank
        FROM scores s
        WHERE s.game_id = $1
        GROUP BY s.user_id
      )
      SELECT user_id, best_score, rank FROM ranked WHERE user_id = $2
    `;
    const { rows } = await pool.query(query, [gameId, userId]);
    return rows[0] || { user_id: userId, best_score: 0, rank: null };
  },

  async getTopPlayersByPeriod(from: string, to: string, limit = 100, offset = 0) {
    const query = `
      SELECT u.id as user_id, u.username, SUM(s.score) as total_score
      FROM scores s
      JOIN users u ON s.user_id = u.id
      WHERE s.submitted_at BETWEEN $1 AND $2
      GROUP BY u.id, u.username
      ORDER BY total_score DESC
      LIMIT $3 OFFSET $4
    `;
    const { rows } = await pool.query(query, [from, to, limit, offset]);
    return rows;
  },
};

export default leaderboardService;
