# Blog Platform

A full-stack blogging platform built with Next.js, Node.js, and PostgreSQL.

## Development Setup

1. Clone the repository
2. Run `npm install` in both frontend and backend directories
3. Set up PostgreSQL database
4. Configure environment variables
5. Run `docker-compose up` or use individual start commands

## Available Scripts

- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build both applications

# System Design

## Architecture Overview

The application follows a client-server architecture with separate frontend and backend services.

### Components

1. **Frontend (Next.js)**
   - Pages routing with App Router
   - Redux for global state management
   - API client for backend communication
   - Responsive UI components

2. **Backend (Node.js/Express)**
   - RESTful API endpoints
   - JWT-based authentication
   - Prisma ORM for database operations
   - Repository pattern for data access

3. **Database (PostgreSQL)**
   - Users table with authentication data
   - Posts table with user relationships
   - Sessions for token management

### Data Flow

1. User interacts with Next.js frontend
2. Frontend dispatches Redux actions
3. API client sends requests to Express backend
4. Backend validates requests and processes with Prisma
5. Responses flow back through the chain

### Design Decisions

1. **Next.js**: Chosen for SSR capabilities and excellent developer experience
2. **Redux Toolkit**: Simplified state management with built-in best practices
3. **Prisma**: Type-safe database queries and migrations
4. **JWT**: Stateless authentication suitable for REST APIs
5. **Repository Pattern**: Abstract data access for testability and maintainability