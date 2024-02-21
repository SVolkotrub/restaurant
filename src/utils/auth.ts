import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./connect";

// import { PrismaAdapter } from "@auth/prisma-adapter";
// import getServerSession, { NextAuthOptions } from "next-auth";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID as string,
//       clientSecret: process.env.GOOGLE_SECRET as string,
//     }),
//   ],
// };

// export default function getAuthSession() {
//   getServerSession(authOptions);
// }

import NextAuth, { User } from "next-auth";

import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSideProps } from "next/dist/build/templates/pages";

declare module "next-auth" {
  interface Session {
    user: User & {
      isAdmin: Boolean;
    };
  }
}
declare module "@auth/core/jwt" {
  interface JWT {
    isAdmin: Boolean;
  }
}
export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  // session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async jwt({ token }) {
      const userInDb = await prisma.user.findUnique({
        where: { email: token.email! },
      });
      token.isAdmin = userInDb?.isAdmin!;

      return token;
    },
  },
});
export const getAuthSession = async () => await auth();
