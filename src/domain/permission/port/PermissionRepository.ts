import { Permission } from "../Permisson";
import { PermissionType } from "../../../shared/enums/PermissionType";
import type { CommandResult } from "../../../shared/types";

export interface PermissionRepository {
    grantPermission(permission: Permission): Promise<CommandResult<string>>;
    getPermissions(userId: string): Promise<Permission[] | null>;
    revokePermission(id: string): Promise<CommandResult<string>>;
}