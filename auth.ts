import type { NextAuthOptions } from "next-auth";



import GoogleProvider from "next-auth/providers/google";



import { prisma } from "@/lib/prisma";



function ownerEmail(): string | undefined {

  return process.env.OWNER_EMAIL?.trim().toLowerCase();

}



function isOwnerEmail(email: string | null | undefined): boolean {

  if (!email || !ownerEmail()) return false;

  return email.trim().toLowerCase() === ownerEmail();

}



export const authOptions: NextAuthOptions = {

  providers: [

    GoogleProvider({

      clientId: process.env.GOOGLE_CLIENT_ID!,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET!

    })

  ],



  callbacks: {

    async signIn({ user }) {

      if (!user?.email) return false;



      await prisma.user.upsert({

        where: { email: user.email },

        update: {},

        create: {

          email: user.email,

          name: user.name || "Unknown",

          role: isOwnerEmail(user.email) ? "OWNER" : "USER"

        }

      });



      return true;

    },



    async jwt({ token, user, trigger, session }) {

      const email = (user?.email ?? token.email) as string | undefined;



      if (email) {

        const dbUser = await prisma.user.findUnique({

          where: { email },

          select: { role: true, mfaEnabled: true }

        });



        if (isOwnerEmail(email) || dbUser?.role === "OWNER") {

          token.role = "OWNER";

          token.mfaEnabled = dbUser?.mfaEnabled ?? false;

          token.mfaVerified = !(dbUser?.mfaEnabled ?? false);

        } else {

          delete token.role;

          token.mfaEnabled = false;

          token.mfaVerified = false;

        }

      }



      if (trigger === "update" && session) {

        const patch = session as { mfaVerified?: boolean; mfaEnabled?: boolean };

        if (patch.mfaVerified === true) {

          token.mfaVerified = true;

        }

        if (patch.mfaEnabled === true) {

          token.mfaEnabled = true;

          token.mfaVerified = true;

        }

        if (patch.mfaEnabled === false) {

          token.mfaEnabled = false;

          token.mfaVerified = true;

        }

      }



      return token;

    },



    async session({ session, token }) {

      if (session.user) {

        session.user.role = token.role as string | undefined;

        session.user.mfaEnabled = Boolean(token.mfaEnabled);

        session.user.mfaVerified = Boolean(token.mfaVerified);

      }



      return session;

    }

  },



  secret: process.env.NEXTAUTH_SECRET

};

