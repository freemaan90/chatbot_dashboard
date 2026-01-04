import { Contact } from "./Contact";

 export interface User {
    id: string;
    name: string | null;
    lastName?: string;
    email: string;
    image?: string | null;
    phone?: string;
    contact?: Contact;
    location?: unknown;
  }