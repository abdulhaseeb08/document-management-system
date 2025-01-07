import { Permission } from "../Permisson";
import { PermissionType } from "../../../shared/PermissionType";

export interface PermissionRepository {
    grantPermission(permission: Permission): Promise<void>;
    revokePermission(userId: string, documentId: string, permissionType: PermissionType): Promise<void>;
    hasPermission(userId: string, documentId: string, permissionType: PermissionType): Promise<boolean>;
}