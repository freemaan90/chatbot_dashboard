import { Contact } from "./Contact";
import { WhatsApp } from "./WhatsApp";

 export interface User {
    id: string;
    name: string | null;
    lastName?: string;
    email: string;
    image?: string | null;
    phone?: string;
    contact?: Contact;
    location?: unknown;
    whatsapp?: WhatsApp;
  }