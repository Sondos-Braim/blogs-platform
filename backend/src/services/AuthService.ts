import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { PrismaClient, User } from '@prisma/client';

// Interface for sanitized user (without password)
export interface SanitizedUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService {
  private userRepository: UserRepository;
  private sessionRepository: SessionRepository;
  private jwtSecret: string;

  constructor(prisma: PrismaClient) {
    this.userRepository = new UserRepository(prisma);
    this.sessionRepository = new SessionRepository(prisma);
    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    
    // Validate JWT secret in production
    if (process.env.NODE_ENV === 'production' && this.jwtSecret === 'fallback-secret') {
      throw new Error('JWT_SECRET must be set in production environment');
    }
  }

  async register(email: string, password: string, name: string): Promise<{ user: SanitizedUser; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.userRepository.createUser({
      email,
      password: hashedPassword,
      name
    });

    // Generate token
    const token = this.generateToken(user.id);

    // Create session
    await this.sessionRepository.createSession(user.id, token);

    return { user: this.sanitizeUser(user), token };
  }

  async login(email: string, password: string): Promise<{ user: SanitizedUser; token: string }> {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user.id);

    // Create session
    await this.sessionRepository.createSession(user.id, token);

    return { user: this.sanitizeUser(user), token };
  }

  async logout(token: string): Promise<void> {
    await this.sessionRepository.deleteByToken(token);
  }

  async validateToken(token: string): Promise<SanitizedUser> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      const session = await this.sessionRepository.findValidSession(decoded.userId, token);
      
      if (!session) {
        throw new Error('Invalid session');
      }

      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      return this.sanitizeUser(user);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign(
      { userId }, 
      this.jwtSecret, 
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
      } as jwt.SignOptions
    );
  }

  private sanitizeUser(user: User): SanitizedUser {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser as SanitizedUser;
  }
}