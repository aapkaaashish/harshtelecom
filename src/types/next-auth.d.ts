import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's ID */
      id?: string;
      /** The user's name */
      name?: string | null;
      /** The user's email */
      email?: string | null;
      /** The user's image */
      image?: string | null;
      /** The user's role */
      role?: string;
    };
  }

  /** The shape of the token returned in the JWT */
  interface JWT {
    /** The user's role */
    role?: string;
  }
}