import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Mock user data - in a real app, this would come from a database
const users = [
  {
    id: "1",
    name: "Admin",
    email: "admin@harsh-telecom.in",
    password: await bcrypt.hash("adminpassword", 10), // hashed password
    role: "admin",
  },
  {
    id: "2",
    name: "Technician",
    email: "tech@harsh-telecom.in",
    password: await bcrypt.hash("techpassword", 10), // hashed password
    role: "user",
  },
];

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Check if email and password are provided
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            return null;
          }

          // Find user by email
          const user = users.find(u => u.email === credentials.email);

          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }

          // Check password
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            console.log('Invalid password for user:', credentials.email);
            return null;
          }

          console.log('Login successful for:', credentials.email);
          // Return user object
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login', // Custom sign-in page
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      // Persist the role to the token
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT & { role?: string } }) {
      // Send properties to the client, like role
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
};