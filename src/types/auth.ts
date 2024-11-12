import { Session } from "next-auth";

export type UserRole = 'admin' | 'usuario';

export interface ExtendedSession extends Session {
  user: {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
  }
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
} 