import type { Permission } from "../Permisson";
import type { CommandResult } from "../../../../shared/types";

export interface PermissionRepository {
    grantPermission(permission: Permission): Promise<CommandResult<string>>;
    getPermissions(userId: string): Promise<Permission[] | null>;
    revokePermission(id: string): Promise<CommandResult<string>>;
}