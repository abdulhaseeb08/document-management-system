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
import { PermissionAlreadyExistsError, PermissionCreationError, PermissionDeleteError, PermissionDoesNotExistError } from "../../errors/PermissionErrors";
import type { UserRepository } from "../../../domain/entities/user/port/UserRepository";
import type { DocumentRepository } from "../../../domain/entities/document/port/DocumentRepository";
import { DocumentRole } from "../../../shared/enums/DocumentRole";

@injectable()
export class PermissionService {
    constructor(@inject(INVERIFY_IDENTIFIERS.PermissionRepository) private permissionRepository: PermissionRepository,
                @inject(INVERIFY_IDENTIFIERS.UserRepository) private userRepository: UserRepository,
                @inject(INVERIFY_IDENTIFIERS.DocumentRepository) private documentRepository: DocumentRepository,
                @inject(INVERIFY_IDENTIFIERS.JWT) private jwtAdapter: JWTAuth,
                @inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger) {}

    public async grantPermission(grantPermissionDto: GrantPermissionDtoType): Promise<Result<Permission, Error>> {
        const secretKey = this.jwtAdapter.createSecretKey();
        const res = await (await this.jwtAdapter.verify(grantPermissionDto.token, secretKey))
            .flatMap(async (payload) => {
                const creatorId = payload.userId as UUID;
                return (await this.userRepository.get(grantPermissionDto.userId))
                    .flatMap(async () => (await this.documentRepository.get(grantPermissionDto.documentId))
                        .flatMap( (document) => {
                            if (document.creatorId !== creatorId) {
                                return Result.Err(new PermissionCreationError("Only the creator of a document can grant permissions"));
                            }
                            return Result.Ok(document);
                        })
                        .flatMap(async () => (await this.permissionRepository.getPermissions(grantPermissionDto.userId))
                            .flatMap(async (permissions) => {

                                if (grantPermissionDto.permissionType === DocumentRole.CREATOR && grantPermissionDto.userId !== creatorId) {
                                    return Result.Err(new PermissionCreationError("A creator role can only be assigned to the creator of a document themselves"));
                                }
                                
                                const existingPermission = permissions.find(permission => 
                                    permission.documentId === grantPermissionDto.documentId &&
                                    permission.permissionType === grantPermissionDto.permissionType
                                ) || permissions.find(permission =>
                                    permission.documentId === grantPermissionDto.documentId &&
                                    permission.permissionType === DocumentRole.CREATOR
                                );

                                if (existingPermission) {
                                    return Result.Err(new PermissionAlreadyExistsError("Permission already exists"));
                                }

                                return await PermissionEntity.create(grantPermissionDto.userId as UUID, creatorId, grantPermissionDto.documentId as UUID, grantPermissionDto.permissionType)
                                    .flatMap(async (permission) => await this.permissionRepository.grantPermission(permission));
                            })
                        )
                    );
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
                return (await this.documentRepository.get(revokePermissionDto.documentId))
                    .flatMap( (document) => {
                        if (document.creatorId !== creatorId) {
                            return Result.Err(new PermissionDeleteError("Only the creator of a document can revoke permissions"));
                        }
                        return Result.Ok(document);
                    })
                    .flatMap(async () => (await this.permissionRepository.getPermissions(revokePermissionDto.userId))
                        .flatMap(async (permissions) => {

                            if (revokePermissionDto.permissionType === DocumentRole.CREATOR) {
                                return Result.Err(new PermissionDeleteError("A creator role cannot be revoked. The creator of the document has to delete the document to remove the creator role."));
                            }

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
                        })
                    );
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