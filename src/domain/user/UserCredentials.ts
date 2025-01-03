import { UserRole } from "../../shared/UserRole";

export interface UserCredentials {
  email: string;
  password: string;
  role: UserRole;
}