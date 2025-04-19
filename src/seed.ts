// Seed script for leaderboard test data
import pool from './db';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    // Clean up existing data
    await pool.query('DELETE FROM scores');
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM games');

    // Insert games
    const games = ['Chess', 'Tetris', 'Pac-Man'];
    const gameIds: number[] = [];
    for (const name of games) {
      const res = await pool.query('INSERT INTO games (name) VALUES ($1) RETURNING id', [name]);
      gameIds.push(res.rows[0].id);
    }

    // Insert users
    const users = [
      { username: 'alice', password: 'password1' },
      { username: 'bob', password: 'password2' },
      { username: 'carol', password: 'password3' },
      { username: 'dave', password: 'password4' },
    ];
    const userIds: number[] = [];
    for (const user of users) {
      const hash = await bcrypt.hash(user.password, 10);
      const res = await pool.query(
        'INSERT INTO users (username, password_hash, created_at) VALUES ($1, $2, NOW()) RETURNING id',
        [user.username, hash]
      );
      userIds.push(res.rows[0].id);
    }

    // Insert scores (randomized for variety)
    const now = new Date();
    for (const userId of userIds) {
      for (const gameId of gameIds) {
        for (let i = 0; i < 3; i++) {
          const score = Math.floor(Math.random() * 1000) + 1;
          const submittedAt = new Date(now.getTime() - Math.floor(Math.random() * 1000000000));
          await pool.query(
            'INSERT INTO scores (user_id, game_id, score, submitted_at) VALUES ($1, $2, $3, $4)',
            [userId, gameId, score, submittedAt]
          );
        }
      }
    }

    console.log('Seed data inserted successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await pool.end();
  }
}

seed();
