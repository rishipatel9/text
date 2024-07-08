import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient();
const NEXT_AUTH = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXT_SECRET,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  events: {
    async signIn({ user, isNewUser }:{user:any,isNewUser:any}) {
      if (isNewUser) {
        // Create a new user in your database
        await prisma.user.create({
          data: {
            email: user.email || '',
            name: user.name || '',
          },
        });
      }
    },
  }
};

export { NEXT_AUTH };
