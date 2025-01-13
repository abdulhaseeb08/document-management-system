import { Permission } from "../../domain/permission/Permisson";
import type { PermissionRepository } from "../../domain/permission/port/PermissionRepository";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../infra/di/inversify/inversify.types";
import { PermissionType } from "../../shared/enums/PermissionType";
import type { CommandResult } from "../../shared/types";

@injectable()
export class PermissionService {
    constructor(@inject(INVERIFY_IDENTIFIERS.PermissionService) private permissionRepository: PermissionRepository) {}

    public async grantPermission(creatorId: string, userId: string, documentId: string, permissionType: PermissionType): Promise<CommandResult<string>> {
        const permission = new Permission(userId, creatorId, documentId, permissionType, new Date());
        const res = await this.permissionRepository.grantPermission(permission);
        if (res.success) {
            return {success: true, value: res.value};
        }
        return {success: false, error: res.error};
    }

    public async revokePermission(requestorId: string, userId: string, documentId: string, permissionType: PermissionType): Promise<CommandResult<string>> {
        const hasPerm = await this.hasPermission(requestorId, userId, documentId, permissionType)
        if (hasPerm) {
            const res = await this.permissionRepository.revokePermission(hasPerm.id);
            if (res.success) {
                return {success: true, value: res.value};
            }
            return {success: false, error: res.error};
        }
        return {success: false, error: "Either permission does not exist or access denied"};
    }

    public async hasPermission(requestorId: string, userId: string, documentId: string, permissionType: PermissionType): Promise<Permission | null> {
        const res = await this.permissionRepository.getPermissions(userId);
        if (res) {
            return res.find(
                (item) => 
                    item.creatorId === requestorId &&
                    item.userId === userId &&
                    item.documentId === documentId &&
                    item.permissionType === permissionType
            ) ?? null;
        };
        return null;
    }
}