import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig, isAdminEmail } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  events: {
    // Keep the DB role in sync with ADMIN_EMAILS on every sign-in.
    async signIn({ user }) {
      if (user?.id && user?.email && isAdminEmail(user.email)) {
        await prisma.user
          .update({ where: { id: user.id }, data: { role: "ADMIN" } })
          .catch(() => {});
      }
    },
  },
});
