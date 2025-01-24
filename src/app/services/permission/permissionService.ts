import { PermissionEntity } from "../../../domain/entities/permission/PermissionEntity";
import type { Permission } from "../../../domain/entities/permission/Permisson";
import type { PermissionRepository } from "../../../domain/entities/permission/port/PermissionRepository";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../../infra/di/inversify/inversify.types";
import type { UUID } from "../../../shared/types";
import type { GrantPermissionDtoType, RevokePermissionDtoType } from "../../dtos/PermissionDtos";
import { Result, matchRes } from "joji-ct-fp";
import type { Logger } from "../../ports/logger/logger";
import type { JWTAuth } from "../../ports/jwt/jwt";
import { PermissionAlreadyExistsError, PermissionDoesNotExistError } from "../../errors/PermissionErrors";

@injectable()
export class PermissionService {
    constructor(@inject(INVERIFY_IDENTIFIERS.PermissionRepository) private permissionRepository: PermissionRepository, 
                @inject(INVERIFY_IDENTIFIERS.JWT) private jwtAdapter: JWTAuth,
                @inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger) {}

    public async grantPermission(grantPermissionDto: GrantPermissionDtoType): Promise<Result<Permission, Error>> {
        const secretKey = this.jwtAdapter.createSecretKey();
        const res = await (await this.jwtAdapter.verify(grantPermissionDto.token, secretKey))
            .flatMap(async (payload) => {
                const creatorId = payload.userId as UUID;
                return (await this.permissionRepository.getPermissions(grantPermissionDto.userId))
                    .flatMap(async (permissions) => {
                        const existingPermission = permissions.find(permission => 
                            permission.documentId === grantPermissionDto.documentId &&
                            permission.permissionType === grantPermissionDto.permissionType
                        );

                        if (existingPermission) {
                            return Result.Err(new PermissionAlreadyExistsError("Permission already exists"));
                        }

                        return await PermissionEntity.create(grantPermissionDto.userId as UUID, creatorId, grantPermissionDto.documentId as UUID, grantPermissionDto.permissionType)
                            .flatMap(async (permission) => await this.permissionRepository.grantPermission(permission));
                    });
            });
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

    public async getPermissions(userId: string): Promise<Result<Permission[], Error>> {
        return await this.permissionRepository.getPermissions(userId);
    }

    public async revokePermission(revokePermissionDto: RevokePermissionDtoType): Promise<Result<boolean, Error>> {
        const secretKey = this.jwtAdapter.createSecretKey();
        const res = await (await this.jwtAdapter.verify(revokePermissionDto.token, secretKey))
            .flatMap(async (payload) => {
                const creatorId = payload.userId as UUID;
                return (await this.permissionRepository.getPermissions(revokePermissionDto.userId))
                    .flatMap(async (permissions) => {
                        const permissionToRevoke = permissions.find(permission => 
                            permission.documentId === revokePermissionDto.documentId &&
                            permission.permissionType === revokePermissionDto.permissionType &&
                            permission.creatorId === creatorId
                        );

                        if (!permissionToRevoke) {
                            this.logger.warn(`Permission not found for user ID: ${revokePermissionDto.userId}, document ID: ${revokePermissionDto.documentId}, permission type: ${revokePermissionDto.permissionType}`);
                            return Result.Err(new PermissionDoesNotExistError("Permission does not exist"));
                        }

                        return await this.permissionRepository.revokePermission(permissionToRevoke.id);
                    });
            });

        return matchRes(res, {
            Ok: () => {
                this.logger.info(`Permission revoked successfully`);
                return Result.Ok(true);
            },
            Err: (err) => {
                this.logger.error(`Error occurred during permission revocation ${err}`);
                return Result.Err(err);
            }
        });
    }

}