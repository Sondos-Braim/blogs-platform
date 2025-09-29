import { PrismaClient, Session } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

export class SessionRepository extends BaseRepository<Session> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'session');
  }

  async createSession(userId: string, token: string): Promise<Session> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    return this.create({
      userId,
      token,
      expiresAt
    });
  }

  async findValidSession(userId: string, token: string): Promise<Session | null> {
    return this.prisma.session.findFirst({
      where: {
        userId,
        token,
        expiresAt: { gt: new Date() }
      }
    });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { token } });
  }
}