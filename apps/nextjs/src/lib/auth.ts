import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import prisma from "./prisma";
import { sendEmail } from "@/utils/email";

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
    async signIn({ user, account }: { user: any; account: any }) {
      // console.log("SignIn event triggered");
      // console.log("User:", user);
      // console.log("Account:", account);
      try {
        const ifExists = await prisma.user.findFirst({
          where: {
            email: user.email,
          },
        });
        if (!ifExists) {
          await sendWelcomeEmail(user);
          console.log("Welcome email sent");
          await prisma.user.create({
            data: {
              email: user.email || "",
              name: user.name || "",
              image: user.image || "",
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          });
          console.log("User created successfully");
        }
      } catch (error) {
        console.error("Error creating user : ", error);
      }
    },
  },
};
async function sendWelcomeEmail(user: any) {
  const { email, name } = user;
  const subject = "Welcome to Our Service!";
  const text = `Hello ${name},\n\nWelcome to our service! We are glad to have you on board.\n\nBest regards,\nThe Team`;
  const html = `<p>Hello ${name},</p><p>Welcome to our service! We are glad to have you on board.</p><p>Best regards,<br>The Team</p>`;

  await sendEmail({ to: email, subject, text, html });
}
export { NEXT_AUTH };
