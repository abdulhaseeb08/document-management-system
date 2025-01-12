import { Permission } from "../Permisson";
import { PermissionType } from "../../../shared/enums/PermissionType";
import type { CommandResult } from "../../../shared/types";

export interface PermissionRepository {
    grantPermission(permission: Permission): Promise<CommandResult<string>>;
    revokePermission(requestorId: string, userId: string, documentId: string, permissionType: PermissionType): Promise<CommandResult<string>>;
    hasPermission(userId: string, documentId: string, permissionType: PermissionType): Promise<boolean>;
}