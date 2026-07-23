import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    idToken?: string;
    user: DefaultSession["user"] & {
      id: string;
      groups: string[];
      firstName?: string;
      lastName?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    idToken?: string;
    id: string;
    groups: string[];
    firstName?: string;
    lastName?: string;
  }
}
