import { Request, Response } from 'express';
import leaderboardService from '../services/leaderboardService';

const leaderboardController = {
  async getGlobalLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const limit = Math.min(Number(req.query.limit) || 100, 200);
      const offset = Math.max(Number(req.query.offset) || 0, 0);
      const username = req.query.username as string | undefined;
      const leaderboard = await leaderboardService.getGlobalLeaderboard(limit, offset, username);
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch global leaderboard', details: err instanceof Error ? err.message : err });
    }
  },

  async getGameLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const { gameId } = req.params;
      const limit = Math.min(Number(req.query.limit) || 100, 200);
      const offset = Math.max(Number(req.query.offset) || 0, 0);
      const username = req.query.username as string | undefined;
      if (!gameId || isNaN(Number(gameId))) {
        res.status(400).json({ error: 'Invalid gameId' });
        return;
      }
      const leaderboard = await leaderboardService.getGameLeaderboard(gameId, limit, offset, username);
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch game leaderboard', details: err instanceof Error ? err.message : err });
    }
  },

  async getUserRank(req: Request, res: Response): Promise<void> {
    try {
      const { gameId } = req.params;
      // @ts-ignore
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      if (!gameId || isNaN(Number(gameId))) {
        res.status(400).json({ error: 'Invalid gameId' });
        return;
      }
      const rank = await leaderboardService.getUserRank(userId, gameId);
      res.json(rank);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user rank', details: err instanceof Error ? err.message : err });
    }
  },

  async getTopPlayersByPeriod(req: Request, res: Response): Promise<void> {
    try {
      const { from, to } = req.query;
      const limit = Math.min(Number(req.query.limit) || 100, 200);
      const offset = Math.max(Number(req.query.offset) || 0, 0);
      if (!from || !to) {
        res.status(400).json({ error: 'Missing from or to date' });
        return;
      }
      const leaderboard = await leaderboardService.getTopPlayersByPeriod(from as string, to as string, limit, offset);
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch top players', details: err instanceof Error ? err.message : err });
    }
  },
};

export default leaderboardController;
