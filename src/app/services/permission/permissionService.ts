import { PermissionEntity } from "../../../domain/entities/permission/PermissionEntity";
import type { Permission } from "../../../domain/entities/permission/Permisson";
import type { PermissionRepository } from "../../../domain/entities/permission/port/PermissionRepository";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../../infra/di/inversify/inversify.types";
import type { UUID } from "../../../shared/types";
import type { GrantPermissionDtoType } from "../../dtos/PermissionDtos";
import { Result, matchRes } from "joji-ct-fp";
import type { Logger } from "../../ports/logger/logger";
@injectable()
export class PermissionService {
    constructor(@inject(INVERIFY_IDENTIFIERS.PermissionRepository) private permissionRepository: PermissionRepository, @inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger) {}

    public async grantPermission(grantPermissionDto: GrantPermissionDtoType): Promise<Result<Permission, Error>> {
        const res = await PermissionEntity.create(grantPermissionDto.userId as UUID, grantPermissionDto.creatorId as UUID, grantPermissionDto.documentId as UUID, grantPermissionDto.permissionType)
            .flatMap(async (permission) => await this.permissionRepository.grantPermission(permission));
        
        return matchRes(res, {
            Ok: (res) => {
                this.logger.info(`Permission created successfully with ID: ${res.id}`);
                return Result.Ok(res);
            },
            Err: (err) => {
                this.logger.error(`Error occurred during permission creation ${err}`);
                return Result.Err(err);
            }
        });
    }

    // public async revokePermission(requestorId: string, userId: string, documentId: string, permissionType: PermissionType): Promise<CommandResult<string>> {
    //     const hasPerm = await this.hasPermission(requestorId, userId, documentId, permissionType)
    //     if (hasPerm) {
    //         const res = await this.permissionRepository.revokePermission(hasPerm.id);
    //         if (res.success) {
    //             return {success: true, value: res.value};
    //         }
    //         return {success: false, error: res.error};
    //     }
    //     return {success: false, error: Error("Either permission does not exist or access denied")};
    // }

    // public async hasPermission(requestorId: string, userId: string, documentId: string, permissionType: PermissionType): Promise<Permission | null> {
    //     const res = await this.permissionRepository.getPermissions(userId);
    //     if (res) {
    //         return res.find(
    //             (item) => 
    //                 item.creatorId === requestorId &&
    //                 item.userId === userId &&
    //                 item.documentId === documentId &&
    //                 item.permissionType === permissionType
    //         ) ?? null;
    //     };
    //     return null;
    // }
}