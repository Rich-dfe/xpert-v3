import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    idToken?: string;
    expiresAt: number;
    user: DefaultSession["user"] & {
      id: string;
      email: string | null | undefined;
      customerId: string;
      groups: string[];
      firstName?: string;
      lastName?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    idToken?: string;
    expiresAt: number;
    id: string;
    email: string | null | undefined;
    customerId: string;
    groups: string[];
    firstName?: string;
    lastName?: string;
  }
}
