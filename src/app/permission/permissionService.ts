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
        const permission = new Permission(userId, creatorId, documentId, permissionType);
        const res = await this.permissionRepository.grantPermission(permission);
        if (res.success) {
            return {success: true, value: res.value};
        }
        return {success: false, error: res.error};
    }

    public async revokePermission(requestorId: string, userId: string, documentId: string, permissionType: PermissionType): Promise<CommandResult<string>> {
        const hasPerm = await this.hasPermission(userId, documentId, permissionType)
        if (hasPerm) {
            const res = await this.permissionRepository.revokePermission(requestorId, userId, documentId, permissionType);
            if (res.success) {
                return {success: true, value: res.value};
            }
            return {success: false, error: res.error};
        }
        return {success: false, error: "Cannot delete a permission that does not exist against the requested User"};
    }

    public async hasPermission(userId: string, documentId: string, permissionType: PermissionType): Promise<boolean> {
        return this.permissionRepository.hasPermission(userId, documentId, permissionType);
    }
}