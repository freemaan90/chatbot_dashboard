
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
      
          if (!res.ok) {
            // Log detallado para ver por qué cayó
            const errText = await res.text().catch(() => "");
            console.warn("Login failed:", res.status, errText);
            return null;
          }
      
          const data = await res.json();
      
          // Aceptar variantes de nombres
          const user = data.user ?? data?.data?.user ?? null;
          const accessToken = data.access_token ?? data?.token ?? null;
      
          if (!user || !accessToken) {
            console.warn("Login payload missing fields:", data);
            return null;
          }
      
          // Mapear campos con fallback
          const firstName = user.firstName ?? user.name ?? "";
          const lastName = user.lastName ?? user.surname ?? "";
      
          return {
            id: String(user.id), // NextAuth suele esperar string
            name: [firstName, lastName].filter(Boolean).join(" ") || user.name || "",
            email: user.email,
            lastName,
            accessToken,
            phone: user.phone ?? null,
            contact: user.contact ?? null,
            location: user.location ?? null,
          } as any;
        } catch (e) {
          console.error("Authorize error:", e);
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
  
      // Enriquecer con datos actualizados del backend
      try {
        if (token.accessToken) {
          const res = await fetch(`${process.env.API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token.accessToken}` },
          });
          if (res.ok) {
            const fullUser = await res.json();
            session.user.contact = fullUser.contact ?? session.user.contact ?? null;
            session.user.location = fullUser.location ?? session.user.location ?? null;
            // Podés actualizar firstName/lastName si el backend tiene esos campos
          } else {
            console.warn("auth/me failed:", res.status, await res.text());
          }
        }
      } catch (e) {
        console.warn("No se pudo enriquecer la sesión con /auth/me", e);
      }
  
      return session;
    },
  }
  

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
``
