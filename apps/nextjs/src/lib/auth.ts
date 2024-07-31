import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import prisma from "./prisma";
import { sendEmail } from "@/utils/email";
import { toast } from "react-toastify";

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
    error: "/auth/error", // Custom error page
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      const userExists = await prisma.user.findFirst({
        where: {
          email: session.user.email,
        },
      });

      if (userExists && userExists.provider !== token.provider) {
        throw new Error(
          `You have previously signed in with ${userExists.provider}. Please use ${userExists.provider} to sign in.`,
        );
      }

      session.user.id = token.id;
      session.user.provider = token.provider;
      return session;
    },
    async jwt({
      token,
      account,
      user,
    }: {
      token: any;
      account: any;
      user: any;
    }) {
      if (user) {
        token.id = user.id;
        token.provider = account.provider;
      }
      return token;
    },
  },
  events: {
    async signIn({ user, account }: { account: any; user: any }) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser && existingUser.provider !== account.provider) {
          toast.error(
            `You have previously signed in with ${existingUser.provider}. Please use ${existingUser.provider} to sign in.`,
          );
          throw new Error(
            `You have previously signed in with ${existingUser.provider}. Please use ${existingUser.provider} to sign in.`,
          );
        }

        if (!existingUser) {
          await sendWelcomeEmail({ user });
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          });
        }
      } catch (error) {
        console.error("Error during sign-in: ", error);
      }
    },
  },
};

interface user {
  email: string;
  name: string;
}
async function sendWelcomeEmail({ user }: { user: user }) {
  const { email, name } = user;
  const subject = "Welcome to Our Service!";
  const text = `Hello ${name},\n\nWelcome to our text.! We are glad to have you on board.\n\nBest regards,\nThe Team`;
  const html = `<p>Hello ${name},</p><p>Welcome to our text.! We are glad to have you on board.</p><p>Best regards,<br>text. team</p>`;

  await sendEmail({ to: email, subject, text, html });
}

export { NEXT_AUTH };
