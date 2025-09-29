import express, { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { PostService } from '../services/PostService';
import { prisma } from '../utils/prisma';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();
const postService = new PostService(prisma);

interface AuthenticatedRequest extends Request {
  user?: any;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await postService.getAllPublishedPosts();
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  [param('id').isString().isLength({ min: 1 })],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await postService.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  authenticate,
  [
    body('title').trim().isLength({ min: 1, max: 255 }),
    body('content').trim().isLength({ min: 1 }),
    body('published').optional().isBoolean()
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const post = await postService.createPost({
        ...req.body,
        authorId: req.user.id
      });
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

router.put('/:id',
  authenticate,
  [
    param('id').isString().isLength({ min: 1 }),
    body('title').optional().trim().isLength({ min: 1, max: 255 }),
    body('content').optional().trim().isLength({ min: 1 }),
    body('published').optional().isBoolean()
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const post = await postService.updatePost(req.params.id, req.user.id, req.body);
      if (!post) {
        return res.status(404).json({ error: 'Post not found or access denied' });
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  authenticate,
  [param('id').isString().isLength({ min: 1 })],
  validateRequest,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const success = await postService.deletePost(req.params.id, req.user.id);
      if (!success) {
        return res.status(404).json({ error: 'Post not found or access denied' });
      }
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;