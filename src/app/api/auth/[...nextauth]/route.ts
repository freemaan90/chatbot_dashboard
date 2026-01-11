
import { apiFetchJson, apiFetchJsonSoft } from "@/lib/api";
import { Contact } from "@/types/Contact";
import { WhatsApp } from "@/types/WhatsApp";
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
          const result = await apiFetchJson('/auth/login', {
            method: 'POST',
            body: { email: credentials.email, password: credentials.password },
          });
      
          // ⚠️ 'result' es el wrapper: { ok, status, data, raw }
          // Lo que te interesa está en result.data
          const payload = (result as any).data ?? result;
      
          // Opcional de debug (solo en dev):
      
          const user =
            payload.user ??
            payload?.data?.user ?? // por si algún backend envía doble anidación
            null;
      
          const accessToken =
            payload.access_token ??
            payload?.token ??
            payload?.data?.access_token ?? // <-- ✅ mirar aquí
            null;
      
          if (!user || !accessToken) {
            console.warn('Login payload missing fields:', result);
            return null;
          }
      
          const firstName = user.firstName ?? user.name ?? '';
          const lastName = user.lastName ?? user.surname ?? '';
      
          return {
            id: String(user.id),
            name: [firstName, lastName].filter(Boolean).join(' ') || user.name || '',
            email: user.email,
            lastName,
            accessToken,
            phone: user.phone ?? null,
            contact: user.contact ?? null,
            location: user.location ?? null,
            whatsapp: user.whatsapp ?? null
          } as any;
        } catch (e) {
          console.warn('Login failed:', e);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
  },



  callbacks: {
    async jwt({ token, user, account }) {
      // En el primer login (Credentials), 'user' viene con lo que devolviste en authorize
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.lastName = (user as any).lastName;
        token.accessToken = (user as any).accessToken;
        token.phone = (user as any).phone;
        token.contact = (user as any).contact;
        token.location = (user as any).location;
        token.whatsapp = (user as any).whatsapp
      }

      // Podrías refrescar aquí si tu token expira y tenés endpoint de refresh
      return token;
    },


async session({ session, token }) {
  session.user = {
    id: token.id as string,
    name: token.name as string,
    lastName: token.lastName as string,
    email: token.email as string,
    phone: token.phone as string,
    contact: token.contact as Contact,
    location: token.location,
    whatsapp: token.whatsapp as WhatsApp,
    image: session.user?.image ?? null
  };

  (session as any).accessToken = token.accessToken;

  try {
    if (token.accessToken) {
      const me = await apiFetchJsonSoft('/auth/me', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      });

      if (me.ok && me.data) {
        session.user.contact = me.data.contact ?? session.user.contact;
        session.user.location = me.data.location ?? session.user.location;
        session.user.whatsapp = me.data.whatsapp ?? session.user.whatsapp;

        // Si tu backend devuelve name y lastName, refrescarlos también
        session.user.name = me.data.name ?? session.user.name;
        session.user.lastName = me.data.lastName ?? session.user.lastName;
      }
    }
  } catch (e) {
    console.warn("No se pudo enriquecer la sesión con /auth/me", e);
  }

  return session;
}
    
  }


};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
