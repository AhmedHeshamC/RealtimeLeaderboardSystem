import { Router } from 'express';
import * as scoreController from '../controllers/scoreController';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// JWT auth middleware
function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/submit', authenticateJWT, scoreController.submitScore);
router.get('/history', authenticateJWT, scoreController.getScoreHistory);

export default router;
