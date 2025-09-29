import { PrismaClient, Post } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

export class PostRepository extends BaseRepository<Post> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'post');
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.findAll({ 
      where: { authorId },
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAllPublished(): Promise<Post[]> {
    return this.findAll({
      where: { published: true },
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByIdWithAuthor(id: string): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, email: true } } }
    });
  }
}