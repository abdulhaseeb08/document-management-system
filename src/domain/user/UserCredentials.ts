import { UserRole } from "../../shared/enums/UserRole";

export interface UserCredentials {
  email: string;
  password: string;
  role: UserRole;
}