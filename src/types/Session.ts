import { User } from "./User";

export interface Session {
    user: User
    accessToken?: string;
  }