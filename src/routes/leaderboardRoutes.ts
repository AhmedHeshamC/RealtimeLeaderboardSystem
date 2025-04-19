import { Router } from 'express';
import leaderboardController from '../controllers/leaderboardController';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Secure JWT authentication middleware
function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization header missing or malformed' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    // Optionally, you can add more checks here (e.g., user status, roles)
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

const router = Router();

// GET /api/leaderboard/global — Global leaderboard
router.get('/global', leaderboardController.getGlobalLeaderboard);

// GET /api/leaderboard/game/:gameId — Leaderboard for a specific game
router.get('/game/:gameId', leaderboardController.getGameLeaderboard);

// GET /api/leaderboard/rank/:gameId — Authenticated user's rank in a game
router.get('/rank/:gameId', authenticateJWT, leaderboardController.getUserRank);

// GET /api/leaderboard/top-players — Top players for a period
router.get('/top-players', leaderboardController.getTopPlayersByPeriod);

export default router;
