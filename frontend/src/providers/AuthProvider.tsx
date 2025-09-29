'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getCurrentUser } from '@/lib/slices/authSlice';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Check if we have a token but user data is not loaded
    if (token && !user) {
      dispatch(getCurrentUser()).finally(() => {
        setInitialized(true);
      });
    } else {
      setInitialized(true);
    }
  }, [dispatch, token, user]);

  // Show loading state until auth is initialized
  if (!initialized && token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}