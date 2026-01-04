
// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { User } from "./types/User";

declare module "next-auth" {
  // Extiende lo que NextAuth guarda en session.user
  export interface Session {
    user: User & DefaultSession["user"];
    accessToken?: string;
  }
}

// También extendé el JWT para que el callback 'jwt' no se queje
declare module "next-auth/jwt" {
  interface JWT {
    id?: number | string;
    name?: string | null;
    email?: string | null;

    lastName?: string;
    phone?: string;
    contact?: unknown;
    location?: unknown;

    accessToken?: string;
  }
}
