'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { clientApi } from '@/lib/api/clientApi';
import css from './AuthNavigation.module.css';
import axios from 'axios';

export default function AuthNavigation() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const clearAuth = useAuthStore(state => state.clearAuth);

  const handleLogout = async (): Promise<void> => {
    setError(null);

    try {
      await clientApi.logout();

      clearAuth();

      router.push('/sign-in');
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message || 'Logout failed on server';
        setError(serverMessage);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to log out. Please try again.');
      }
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>
        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email}</p>
          <button
            className={css.logoutButton}
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>

          {error && <p className={css.logoutError}>{error}</p>}
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}
