import { Address } from "./Address";

export interface Contact {
    id: number;
    company: string | null;
    website: string | null;
    addresses: Address[];
  }
