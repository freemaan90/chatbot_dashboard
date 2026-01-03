
// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Extiende lo que NextAuth guarda en session.user
  interface Session {
    user: {
      name: string | null;
      email: string | null;
      image: string | null;

      // Custom fields
      id?: number | string;
      lastName?: string;
      phone?: string;
      contact?: Contact;
      location?: unknown;
    } & DefaultSession["user"];

    // Campo fuera de user (por ejemplo, token de acceso)
    accessToken?: string;
  }

  // Extiende el objeto 'User' que retorna authorize() y que se pasa al callback jwt
  interface User {
    id: string;
    name: string | null;
    lastName?: string;
    email: string;
    image?: string | null;

    accessToken?: string;

    phone?: string;
    contact?: Contact;
    location?: unknown;
  }

 export interface Contact {
    id: number;
    company: string | null;
    website: string | null;
    addresses: Address[];
  }

  export interface Address {
    id: string;
    zip: string;
    city: string;
    type: string;
    state: string;
    street: string;
    country: string;
    country_code: string;
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
