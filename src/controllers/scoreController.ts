import { Request, Response } from 'express';
import * as scoreService from '../services/scoreService';

export const submitScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { gameId, score } = req.body;
    if (!userId || !gameId || typeof score !== 'number') {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const submitted = await scoreService.submitScore(userId, gameId, score);
    res.status(201).json({ message: 'Score submitted', score: submitted });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getScoreHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const history = await scoreService.getUserScoreHistory(userId);
    res.status(200).json({ history });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
