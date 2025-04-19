import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await authService.register(username, password);
    res.status(201).json({ message: 'User registered', user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const { token, user } = await authService.login(username, password);
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

export const logout = async (_req: Request, res: Response) => {
  // For JWT, logout is handled client-side by deleting the token
  res.status(200).json({ message: 'Logout successful' });
};
