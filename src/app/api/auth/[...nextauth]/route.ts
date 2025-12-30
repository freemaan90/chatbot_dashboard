
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data = await res.json();
          // Esperado: { access_token, user: { id, name, email, avatar? } }
          if (!data?.access_token || !data?.user) return null;

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.avatar ?? null,
            accessToken: data.access_token,
          };
        } catch (e) {
          console.error("Authorize error:", e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // En login, persiste accessToken en el jwt
      if (user?.accessToken) {
        token.accessToken = user.accessToken as string;
      }
      return token;
    },
    async session({ session, token }) {
      // Expone el accessToken en session
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  // Recomendado: configurar correctamente cookies en producción
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
``
