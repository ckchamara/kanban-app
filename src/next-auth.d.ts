import { DefaultSession, DefaultUser } from 'next-auth'; // NextAuth import removed as it's not directly used
import { DefaultJWT } from 'next-auth/jwt'; // JWT import removed

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
    } & DefaultSession['user']; // Keep the default properties
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends DefaultUser {
    /** Add your custom properties here, if any */
    // e.g. role: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** OpenID ID Token */
    // idToken?: string; // Example if you were to store idToken
    /** User ID */
    // sub is already user id by default, but you can add more specific id if needed
    // userId?: string;
  }
}
