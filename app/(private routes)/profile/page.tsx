import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { serverApi } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'View and manage your personal profile information in NoteHub.',
  openGraph: {
    title: 'Profile | NoteHub',
    description:
      'View and manage your personal profile information in NoteHub.',
    url: '/profile',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Profile Preview',
      },
    ],
  },
};

export default async function ProfilePage() {
  let user;

  try {
    user = await serverApi.getMe();
  } catch {
    redirect('/sign-in');
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
