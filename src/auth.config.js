import Google from "next-auth/providers/google";

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email) {
  return !!email && adminEmails.includes(email.toLowerCase());
}

// Edge-safe config (no Prisma adapter here) — shared by middleware and the main auth instance.
export const authConfig = {
  providers: [Google], // reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET automatically
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      const email = user?.email || token.email;
      token.role = isAdminEmail(email) ? "ADMIN" : token.role || "USER";
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role || "USER";
      }
      return session;
    },
  },
};
