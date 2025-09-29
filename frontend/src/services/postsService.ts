import { api } from './api';

export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export class PostsService {
  static async getPosts(): Promise<Post[]> {
    const response = await api.get('/posts');
    return response.data;
  }

  static async getPostById(id: string): Promise<Post> {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  }

  static async createPost(postData: { title: string; content: string; published?: boolean }): Promise<Post> {
    const response = await api.post('/posts', postData);
    return response.data;
  }

  static async updatePost(id: string, postData: Partial<Post>): Promise<Post> {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  }

  static async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  }

  static async getUserPosts(userId: string): Promise<Post[]> {
    const response = await api.get(`/users/${userId}/posts`);
    return response.data.posts;
  }
}