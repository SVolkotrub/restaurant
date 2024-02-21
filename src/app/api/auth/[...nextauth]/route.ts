// import { authOptions } from "@/utils/auth";
// import NextAuth from "next-auth/next";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";

import google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/utils/connect";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    google({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
});
