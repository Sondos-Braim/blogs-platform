# Blog Platform

A full-stack blogging platform with authentication and post management.

## Live Demo
- **Frontend**: 
- **Backend API**: https://blogs-platform-e2i8.onrender.com/api/posts

## Tech Stack

### Frontend:
- **Next.js 14**
- **Redux Toolkit**
- **Tailwind CSS**

### Backend:
- **Node.js**
- **Express**
- **Prisma ORM**

### Database:
- **PostgreSQL** (Supabase)

### Auth:
- **JWT tokens**

### Deployment:
- **Vercel** for Frontend
- **Render** for Backend

## Quick Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-jwt-secret
PORT=3001
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Design Pattern: Repository Pattern

### Implementation:
- Separates data access from business logic
- Centralizes database operations
- Base repository with CRUD operations
- Specialized repositories per entity

### Benefits:
- Easy testing with mocked repositories
- Database changes don't affect business logic
- Consistent data access patterns
- Flexible to change database technology

## System Design Decisions

| Decision               | Justification                              |
|------------------------|--------------------------------------------|
| **Separate Frontend/Backend** | Independent deployment, clear APIs        |
| **JWT Authentication** | Stateless, scalable, mobile-friendly       |
| **Prisma ORM**          | Type-safe, excellent TypeScript support    |
| **Redux Toolkit**       | Predictable state, dev tools, async handling |
| **Component-based UI**  | Reusable, testable, consistent UX         |

## Deployment

### Backend (Render)
- **Build Command**: 
  ```bash
  cd backend && npm install && npx prisma generate && npm run build
  ```
- **Start Command**: 
  ```bash
  npm start
  ```

### Frontend (Vercel)
- **Framework**: Next.js
- **Root Directory**: frontend

## Project Structure

```
blog-platform/
├── frontend/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── middleware/
│   └── prisma/
└── .github/workflows/
```

## Features
- User registration and authentication
- Create, read, update, delete blog posts
- Draft vs published posts
- Author-based permissions
- Responsive design
- RESTful API
