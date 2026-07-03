import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";

// interface Session {
//     user: {
//       id: string;
//       email?: string | null;
//       groups?: string[];
//     };
//   }

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,

  providers: [
    Cognito({
      clientId: process.env.AUTH_COGNITO_ID!,
      clientSecret: process.env.AUTH_COGNITO_SECRET!,
      issuer: process.env.AUTH_COGNITO_ISSUER!,

      authorization: {
        params: {
          prompt: "login",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      if (profile) {
        token.id = profile.sub;
        token.email = profile.email;
        token.groups = profile["cognito:groups"] || [];
        token.firstName = profile.given_name;
        token.lastName = profile.family_name;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.groups = token.groups;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;

      return session;
    },
  },
});
