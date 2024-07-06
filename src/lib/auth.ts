import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { SignupSchema } from "@/utils/types";
import prisma from "@/lib/prisma";

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "name",
          type: "text",
          placeholder: "Enter your name here",
        },
        email: {
          label: "email",
          type: "text",
          placeholder: "Enter your email here",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials: any) {
        console.log(credentials);
      },
    }),
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
    signIn: "/signin", // Ensure this matches your Next.js page route
  },

  // Uncomment and modify as needed
  // callbacks: {
  //   async session(session: any, token: any) {
  //     if (session.user.id) {
  //       session.user.id = token.id;
  //     }
  //     return session;
  //   },
  //   async jwt(token: any, user: any) {
  //     if (user) token.id = user.id;
  //     return token;
  //   },
  // },
};
