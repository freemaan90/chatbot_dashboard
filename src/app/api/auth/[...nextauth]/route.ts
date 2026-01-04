
import { apiFetchJson, apiFetchJsonSoft } from "@/lib/api";
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
      }

      // Podrías refrescar aquí si tu token expira y tenés endpoint de refresh
      return token;
    },


    async session({ session, token }) {
      session.user = {
        name: (token.name as string) ?? session.user?.name ?? null,
        email: (token.email as string) ?? session.user?.email ?? null,
        image: session.user?.image ?? null,
        id: token.id as string | undefined,
        lastName: token.lastName as string | undefined,
        phone: token.phone as string | undefined,
        contact: token.contact as any,
        location: token.location as any,
      } as any;
    
      (session as any).accessToken = token.accessToken;
    
      try {
        if (token.accessToken) {
          const me = await apiFetchJsonSoft('/auth/me', {
            headers: { Authorization: `Bearer ${token.accessToken as string}` },
          });
    
          if (me.ok && me.data) {
            session.user.contact = me.data.contact ?? session.user.contact ?? null;
            session.user.location = me.data.location ?? session.user.location ?? null;
          } else {
            console.warn('auth/me failed:', me.status, me.data);
            // No lanzamos: seguimos con la sesión base
          }
        }
      } catch (e) {
        console.warn('No se pudo enriquecer la sesión con /auth/me', e);
      }
    
      return session;
    }
    
  }


};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
