import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: string;
    mobile: string;
    lastName: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string | null | undefined;
      lastName: string;
      email: string | null | undefined;
      mobile: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    lastName?: string;
    email?: string | null;
    mobile?: string;
    role?: string;
  }
}
