'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { clientApi } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './EditProfilePage.module.css';
import axios from 'axios';

export default function ProfileEditPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await clientApi.getMe();
        setUsername(user.username);
        setEmail(user.email);
        setAvatar(user.avatar);
      } catch (error) {
        console.error(error);
        router.push('/sign-in');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedUser = await clientApi.updateMe({ username });

      setUser(updatedUser);

      router.push('/profile');
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to update profile');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (isLoading) return <div className={css.loading}>Loading...</div>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {avatar && (
          <Image
            src={avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        )}

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              minLength={2}
            />
          </div>

          <p>Email: {email}</p>

          {error && <p>{error}</p>}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
