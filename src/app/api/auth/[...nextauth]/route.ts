import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjusted path if lib is at src/lib

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
