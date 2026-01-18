'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { clientApi } from '@/lib/api/clientApi';
import css from './AuthProvider.module.css';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore(state => state.setUser);
  const clearAuth = useAuthStore(state => state.clearAuth);

  const [isChecking, setIsChecking] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    const validateSession = async () => {
      if (isInitialized.current) return;

      try {
        const user = await clientApi.getMe();
        setUser(user);
      } catch {
        clearAuth();
      } finally {
        isInitialized.current = true;
        setIsChecking(false);
      }
    };

    validateSession();
  }, [setUser, clearAuth]);

  if (isChecking) {
    return (
      <div className={css.loaderContainer}>
        <div className={css.spinner}></div>
      </div>
    );
  }

  return <>{children}</>;
}
