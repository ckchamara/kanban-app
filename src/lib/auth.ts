import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from './mongodb-client-promise';
// import User from '@/models/User'; // Removed as not currently used
// import dbConnect from './db'; // Removed as not currently used

// Validate environment variables
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID environment variable');
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing GOOGLE_CLIENT_SECRET environment variable');
}
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing NEXTAUTH_SECRET environment variable');
}
// MONGODB_URI is validated in db.ts

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: new URL(process.env.MONGODB_URI!).pathname.substring(1) || 'kanban_app_dev',
    collections: {
      Users: 'users', // Ensure this matches your Mongoose model name if needed, or default
      Accounts: 'accounts',
      Sessions: 'sessions',
      VerificationTokens: 'verification_tokens',
    },
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt', // Using JWT for session strategy
  },
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (token && session.user) {
        session.user.id = token.sub as string; // Add user ID to session
        // You can add other properties from the token to the session user if needed
      }
      return session;
    },
    async jwt({ token, user, account }) { // Removed 'profile'
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account && user) {
        // Connect to DB to ensure user is created/updated if using adapter with custom user model logic
        // For simple cases, adapter handles user creation.
        // If you need to merge Mongoose user with NextAuth user, this is a place.
        // However, MongoDBAdapter should handle user creation/linking.
      }
      // The user object is available on first sign-in, token.sub is the user id
      return token;
    },
    // signIn callback can be used for custom logic upon sign-in, e.g., checking if user is allowed
    // async signIn({ user, account, profile, email, credentials }) {
    //   await dbConnect(); // Ensure DB is connected
    //   // Example: Check if the user exists in your Mongoose User collection
    //   // const existingUser = await User.findOne({ email: user.email });
    //   // if (!existingUser) {
    //   //   // Optionally create user here if adapter doesn't cover all needs,
    //   //   // or prevent sign-in if user must be pre-provisioned.
    //   // }
    //   return true; // Return true to continue sign in, false to deny
    // }
  },
  pages: {
    signIn: '/auth/signin', // Optional: Custom sign-in page
    // error: '/auth/error', // Optional: Custom error page
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === 'development', // Optional: Enable debug messages
};
