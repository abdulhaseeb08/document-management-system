import { PermissionEntity } from "../PermissionEntity";
import { Result } from "joji-ct-fp";
import type { Permission } from "../Permisson";

export interface PermissionRepository {
    grantPermission(permission: PermissionEntity): Promise<Result<Permission, Error>>;
    getPermissions(userId: string): Promise<Result<Permission[], Error>>;
    revokePermission(id: string): Promise<Result<boolean, Error>>;
}