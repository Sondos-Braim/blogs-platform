import { PostRepository } from '../repositories/PostRepository';
import { PrismaClient } from '@prisma/client';

export class PostService {
  private postRepository: PostRepository;

  constructor(prisma: PrismaClient) {
    this.postRepository = new PostRepository(prisma);
  }

  async getAllPublishedPosts() {
    return this.postRepository.findAllPublished();
  }

  async getPostById(id: string) {
    return this.postRepository.findByIdWithAuthor(id);
  }

  async createPost(postData: { title: string; content: string; authorId: string; published?: boolean }) {
    return this.postRepository.create(postData);
  }

  async updatePost(id: string, authorId: string, updateData: any) {
    const post = await this.postRepository.findById(id);
    if (!post || post.authorId !== authorId) {
      return null;
    }

    return this.postRepository.update(id, updateData);
  }

  async deletePost(id: string, authorId: string) {
    const post = await this.postRepository.findById(id);
    if (!post || post.authorId !== authorId) {
      return false;
    }

    await this.postRepository.delete(id);
    return true;
  }

  async getUserPosts(authorId: string) {
    return this.postRepository.findByAuthor(authorId);
  }
}