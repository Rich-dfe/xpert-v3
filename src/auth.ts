import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";
import { userService } from "./service/api/userService";

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
      if (account?.id_token) {
        token.idToken = account.id_token;
      }

      if (profile) {
        //token.id = profile.sub;
        token.email = profile.email;
        token.groups = (profile["cognito:groups"] as string[]) ?? [];
        token.firstName = profile.given_name ?? undefined;
        token.lastName = profile.family_name ?? undefined;

        if (profile?.email && account?.id_token) {
          const dbUser = await userService.server.getUserId(
            profile.email,
            account.id_token,
          );

          token.id = dbUser.id.toString();
        }

        // if (profile?.email) {
        //   const dbUser = await userService.server.getUserId(profile.email);
        //   token.id = dbUser.id.toString();
        // }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.groups = token.groups;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;

      //console.log("**** SESSION callback");
      //console.log("**** token.accessToken:", token.accessToken);

      session.idToken = token.idToken;

      //console.log("session.accessToken =", session.accessToken);

      return session;
    },
  },
});
