
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 día
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

        // Llama a tu NestJS API
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
      },
    }),
  ],
  pages: {
    signIn: "/login", // opcional si querés una página custom
  },
  callbacks: {
    async jwt({ token, user }) {
      // Al login, guarda el accessToken; en refresh podría renovarse
      if (user?.accessToken) {
        token.accessToken = user.accessToken as string;
      }
      return token;
    },
    async session({ session, token }) {
      // Expone el accessToken en session para usarlo en fetch del frontend
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  // Seguridad (dominio, HTTPS, cookies, etc.) según tu despliegue
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
