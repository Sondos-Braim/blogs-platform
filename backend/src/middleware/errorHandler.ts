import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error & { code?: string; details?: any },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Prisma errors
  if (error.code?.startsWith('P')) {
    return handlePrismaError(error, res);
  }

  // Validation errors
  if (error.message.includes('Validation failed') || error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message,
      details: error.details || undefined
    });
  }

  // Not found errors
  if (error.message.includes('not found') || error.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not Found',
      message: error.message
    });
  }

  // Authentication errors
  if (error.message.includes('access denied') || 
      error.message.includes('Invalid token') || 
      error.message.includes('Authentication')) {
    return res.status(401).json({
      error: 'Authentication Error',
      message: error.message
    });
  }

  // Authorization errors
  if (error.message.includes('not authorized') || error.message.includes('permission')) {
    return res.status(403).json({
      error: 'Authorization Error',
      message: error.message
    });
  }

  // Unique constraint violations
  if (error.message.includes('already exists') || error.message.includes('unique constraint')) {
    return res.status(409).json({
      error: 'Conflict',
      message: error.message
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

function handlePrismaError(error: any, res: Response) {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      return res.status(409).json({
        error: 'Conflict',
        message: `A resource with this ${error.meta?.target?.[0] || 'field'} already exists`
      });
    
    case 'P2025':
      // Record not found
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found'
      });
    
    case 'P2003':
      // Foreign key constraint violation
      return res.status(400).json({
        error: 'Invalid Reference',
        message: 'The referenced resource does not exist'
      });
    
    default:
      return res.status(500).json({
        error: 'Database Error',
        message: 'An unexpected database error occurred'
      });
  }
}