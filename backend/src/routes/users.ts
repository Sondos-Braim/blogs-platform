import express, { Request, Response, NextFunction } from 'express';
import { param } from 'express-validator';
import { UserService } from '../services/UserService';
import { prisma } from '../utils/prisma';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();
const userService = new UserService(prisma);

interface AuthenticatedRequest extends Request {
  user?: any;
}

router.get('/profile', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  [param('id').isString().isLength({ min: 1 })],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getUserProfile(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
);

router.put('/profile', 
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body;
      
      const updatedUser = await userService.updateUser(req.user.id, { name, email });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ user: updatedUser });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id/posts',
  [param('id').isString().isLength({ min: 1 })],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await userService.getUserPosts(req.params.id);
      res.json({ posts });
    } catch (error) {
      next(error);
    }
  }
);

export default router;