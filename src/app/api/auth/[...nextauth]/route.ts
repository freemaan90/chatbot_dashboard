
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
            name: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            accessToken: data.access_token,
            phone: data.user.phone,
            contact: data.user.contact,
            location: data.user.location
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
      // Durante el login, `user` viene de authorize(); en requests subsecuentes no.
      if (user) {
        token.id = user.id;
        token.name = [user.name, user.lastName].filter(Boolean).join(' ').trim() || user.name || null;
        token.email = user.email;
  
        // Propios:
        token.lastName = user.lastName;
        token.phone = user.phone;
        token.contact = user.contact;
        token.location = user.location;
  
        // Token de acceso
        token.accessToken = user.accessToken;
      }
      return token;
    },
  
    async session({ session, token }) {
      // Reemplaza/expande session.user con lo que guardaste en el token
      session.user = {
        // Estos tres son los que NextAuth expone por defecto:
        name: (token.name as string) ?? session.user?.name ?? null,
        email: (token.email as string) ?? session.user?.email ?? null,
        image: session.user?.image ?? null,
  
        // Campos custom que quieras tener en el front:
        id: token.id as number | string | undefined,
        lastName: token.lastName as string | undefined,
        phone: token.phone as string | undefined,
        contact: token.contact as any,
        location: token.location as any,
      } as any;
  
      // Exponer el accessToken en la sesión para fetchs autenticados
      (session as any).accessToken = token.accessToken;
  
      return session;
    },
  }
  
  // Recomendado: configurar correctamente cookies en producción
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
``
