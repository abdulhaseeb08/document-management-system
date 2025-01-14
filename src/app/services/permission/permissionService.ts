import type { Permission } from "../../../domain/entities/permission/Permisson";
import { PermissionEntity } from "../../../domain/entities/permission/PermissionEntity";
import type { PermissionRepository } from "../../../domain/entities/permission/port/PermissionRepository";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../../infra/di/inversify/inversify.types";
import { PermissionType } from "../../../shared/enums/PermissionType";
import type { CommandResult, UUID } from "../../../shared/types";

@injectable()
export class PermissionService {
    constructor(@inject(INVERIFY_IDENTIFIERS.PermissionService) private permissionRepository: PermissionRepository) {}

    public async grantPermission(creatorId: UUID, userId: UUID, documentId: UUID, permissionType: PermissionType): Promise<CommandResult<string>> {
        const res = PermissionEntity.create(userId, creatorId, documentId, permissionType)
        if (res.success) {
            const permission = await this.permissionRepository.grantPermission(res.value.serialize());
            if (permission.success) {
                return {success: true, value: permission.value};
            }
            return {success: false, error: permission.error};
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
        return {success: false, error: Error("Either permission does not exist or access denied")};
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