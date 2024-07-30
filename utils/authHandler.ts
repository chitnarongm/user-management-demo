import { postLogin } from "@/lib/features/users/userApis";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials) {
        try {
          const response = await postLogin(credentials);
          const { status, data } = response;

          if (status !== 200) throw response;
          return data;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = token;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
