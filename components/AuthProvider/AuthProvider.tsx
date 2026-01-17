'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { clientApi } from '@/lib/api/clientApi';
import css from './AuthProvider.module.css';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useAuthStore(state => state.setUser);
  const clearAuth = useAuthStore(state => state.clearAuth);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

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

  useEffect(() => {
    if (isChecking) return;

    if (isAuthenticated) {
      if (pathname === '/sign-in' || pathname === '/sign-up') {
        router.push('/profile');
      }
    } else {
      if (pathname.startsWith('/notes') || pathname.startsWith('/profile')) {
        router.push('/sign-in');
      }
    }
  }, [pathname, isAuthenticated, isChecking, router]);

  if (isChecking) {
    return (
      <div className={css.loaderContainer}>
        <div className={css.spinner}></div>
      </div>
    );
  }

  return <>{children}</>;
}
