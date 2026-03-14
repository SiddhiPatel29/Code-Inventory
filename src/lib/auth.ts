import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("AUTH: Missing credentials");
          throw new Error("Invalid credentials");
        }

        const email = credentials.email.toLowerCase();

        const user = await prisma.user.findUnique({
          where: {
            email: email
          }
        });

        if (!user) {
          console.log(`AUTH: User not found: ${email}`);
          throw new Error("Invalid credentials");
        }

        if (!user.password) {
          console.log(`AUTH: User has no password set: ${email}`);
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          console.log(`AUTH: Password mismatch for: ${email}`);
          throw new Error("Invalid credentials");
        }

        console.log(`AUTH: Login successful for: ${email}`);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-expect-error NextAuth session user type doesn't include id by default
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  }
};
