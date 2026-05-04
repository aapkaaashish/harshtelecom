import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Mock user data - in a real app, this would come from a database
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: await bcrypt.hash("adminpassword", 10), // hashed password
    role: "admin",
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    password: await bcrypt.hash("userpassword", 10), // hashed password
    role: "user",
  },
];

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Check if email and password are provided
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = users.find(u => u.email === credentials.email);

        if (!user) {
          // No user found
          return null;
        }

        // Check password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          // Invalid password
          return null;
        }

        // Return user object
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  pages: {
    signIn: '/login', // Custom sign-in page
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
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };