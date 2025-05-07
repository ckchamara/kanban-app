'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle'; // Import ThemeToggle

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Kanban App</h1>
          <div className="flex items-center space-x-4"> {/* Container for auth buttons and theme toggle */}
            <ThemeToggle />
            {session ? (
              <div className="flex items-center space-x-2"> {/* Adjusted spacing for inner elements */}
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User avatar'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{session.user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{session.user?.email}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-8">
        {session ? (
          <div>
            <h2 className="text-3xl font-semibold mb-6">Your Boards</h2>
            {/* Placeholder for boards list */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <p>Your Kanban boards will appear here.</p>
              <p className="mt-4">User ID: {session.user?.id}</p> {/* Displaying user ID from augmented session */}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-4">Welcome to Kanban App!</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Please sign in to manage your projects and tasks.
            </p>
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Kanban App. All rights reserved.</p>
      </footer>
    </div>
  );
}
