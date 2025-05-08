'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle'; // Import ThemeToggle
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [showInput, setShowInput] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch boards for the logged-in user
  React.useEffect(() => {
    if (session) {
      fetch('/api/boards')
        .then(res => res.json())
        .then(data => setBoards(data));
    }
  }, [session]);

  const createBoard = async () => {
    if (!boardTitle.trim()) return;
    setLoading(true);
    const res = await fetch('/api/boards', {
      method: 'POST',
      body: JSON.stringify({ title: boardTitle }),
      headers: { 'Content-Type': 'application/json' },
    });
    setLoading(false);
    if (res.ok) {
      setBoardTitle('');
      setShowInput(false);
      // Refresh boards
      fetch('/api/boards')
        .then(res => res.json())
        .then(data => setBoards(data));
    }
  };

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
            <div className="mb-4">
              <Button onClick={() => setShowInput(v => !v)}>
                {showInput ? 'Cancel' : 'Create Board'}
              </Button>
              {showInput && (
                <div className="mt-2 flex gap-2">
                  <input
                    className="border rounded px-2 py-1 text-black"
                    value={boardTitle}
                    onChange={e => setBoardTitle(e.target.value)}
                    placeholder="Board title"
                    disabled={loading}
                  />
                  <Button onClick={createBoard} disabled={loading || !boardTitle.trim()}>
                    {loading ? 'Creating...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              {boards.length === 0 ? (
                <p>Your Kanban boards will appear here.</p>
              ) : (
                <ul>
                  {boards.map(board => (
                    <li key={board._id} className="py-2 border-b last:border-b-0">
                      {board.title}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-4">User ID: {session.user?.id}</p>
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
