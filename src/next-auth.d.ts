
// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Extendemos el User que devuelve authorize()
  interface User {
    accessToken?: string;
    // si querés también id, name, email, image ya existen, pero podés sumar custom fields
  }

  // Extendemos la Session para exponer el token al frontend
  interface Session extends DefaultSession {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  // Extendemos el token JWT que guarda NextAuth
  interface JWT {
    accessToken?: string;
  }
}
