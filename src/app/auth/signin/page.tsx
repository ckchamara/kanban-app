'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react';

type Providers = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;

export default function SignInPage() {
  const [providers, setProviders] = useState<Providers>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  if (!providers) {
    return <div>Loading providers...</div>; // Or a loading spinner
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-8">Sign In</h1>
      {Object.values(providers).map((provider) => {
        // We only configured Google, but this handles multiple providers if added later
        if (provider.id === 'google') { // Only show Google explicitly for now
          return (
            <div key={provider.name}>
              <button
                onClick={() => signIn(provider.id, { callbackUrl: '/' })} // Redirect to homepage after sign-in
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign in with {provider.name}
              </button>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
