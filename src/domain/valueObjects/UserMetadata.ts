import { UserRole } from "../../shared/enums/UserRole";
import type { UUID } from "../../shared/types";

export interface UserMetadata {
    name: string;
    updatedAt: Date;
    userRole: UserRole
}