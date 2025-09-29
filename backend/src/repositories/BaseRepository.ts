import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;
  protected model: string;

  constructor(prisma: PrismaClient, model: string) {
    this.prisma = prisma;
    this.model = model;
  }

  async create(data: any): Promise<T> {
    return (this.prisma as any)[this.model].create({ data });
  }

  async findById(id: string): Promise<T | null> {
    return (this.prisma as any)[this.model].findUnique({ where: { id } });
  }

  async update(id: string, data: any): Promise<T> {
    return (this.prisma as any)[this.model].update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    return (this.prisma as any)[this.model].delete({ where: { id } });
  }

  async findAll(params?: any): Promise<T[]> {
    return (this.prisma as any)[this.model].findMany(params);
  }
}