import bcrypt from 'bcrypt';
import pool from '../db';
import * as jwtUtil from '../utils/jwt';

export const register = async (username: string, password: string) => {
  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, password_hash, created_at) VALUES ($1, $2, NOW()) RETURNING id, username, created_at',
    [username, hashed]
  );
  return result.rows[0];
};

export const login = async (username: string, password: string) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Invalid credentials');
  const token = jwtUtil.generateToken({ id: user.id, username: user.username });
  return { token, user: { id: user.id, username: user.username, created_at: user.created_at } };
};
