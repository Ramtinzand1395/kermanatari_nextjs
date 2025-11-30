// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import { prisma } from "@/lib/prisma"; // (singleton version)
// import { JWT } from "next-auth/jwt";
// import { Session } from "next-auth";
// import { User } from "@prisma/client";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         mobile: { label: "شماره موبایل", type: "text" },
//         password: { label: "رمز عبور", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.mobile || !credentials?.password)
//           throw new Error("شماره موبایل یا رمز عبور وارد نشده است");

//         const user = await prisma.user.findUnique({
//           where: { mobile: credentials.mobile },
//         });

//         if (!user) throw new Error("کاربری با این شماره موبایل یافت نشد");
//         if (!user.password)
//           throw new Error(
//             "این حساب با Google ساخته شده است، لطفاً با Google وارد شوید."
//           );

//         const isValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );
//         if (!isValid) throw new Error("رمز عبور اشتباه است");
//         return {
//           id: user.id.toString(),
//           name: user.name,
//           lastName: user.lastName,
//           email: user.email,
//           mobile: user.mobile,
//           role: user.role,
//         };
//       },
//     }),
//   ],

//   session: { strategy: "jwt" },

//   callbacks: {
//     async jwt({ token, user }: { token: JWT; user?: User }) {
//       if (user) {
//         token.id = user.id.toString();
//         token.name = user.name;
//         token.lastName = user.lastName;
//         token.mobile = user.mobile;
//         token.email = user.email;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({
//       session,
//       token,
//     }: {
//       session: Session;
//       token: JWT & {
//         id?: string;
//         name?: string;
//         lastName?: string;
//         email?: string;
//         mobile?: string;
//         role?: string;
//       };
//     }) {
//       session.user = {
//         id: token.id ?? "",
//         name: token.name ?? "",
//         lastName: token.lastName ?? "",
//         mobile: token.mobile ?? "",
//         email: token.email ?? "",
//         role: token.role ?? "",
//       };
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/auth/login",
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// };

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        mobile: { label: "شماره موبایل", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.mobile || !credentials?.password)
          throw new Error("شماره موبایل یا رمز عبور وارد نشده است");

        const user = await prisma.user.findUnique({
          where: { mobile: credentials.mobile },
        });

        if (!user) throw new Error("کاربری با این شماره موبایل یافت نشد");
        if (!user.password)
          throw new Error(
            "این حساب با Google ساخته شده است، لطفاً با Google وارد شوید."
          );

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("رمز عبور اشتباه است");

        return {
          id: user.id.toString(),
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt", // ✅ اینجا type درست است
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id.toString();
        token.name = user.name;
        token.lastName = user.lastName;
        token.mobile = user.mobile;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id ?? "",
        name: token.name ?? "",
        lastName: token.lastName ?? "",
        mobile: token.mobile ?? "",
        email: token.email ?? "",
        role: token.role ?? "",
      };
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
