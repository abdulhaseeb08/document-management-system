import type { PermissionRepository } from "../../../domain/entities/permission/port/PermissionRepository";
import { PermissionModel } from "../../database/typeorm/models/PermissionModel";
import type { Permission } from "../../../domain/entities/permission/Permisson";
import { Repository, type Relation} from "typeorm";
import { DataSource } from 'typeorm';
import type { UUID } from "../../../shared/types";
import { injectable, inject } from "inversify";
import { Result } from "joji-ct-fp";
import { PermissionDoesNotExistError } from "../../../app/errors/PermissionErrors";
import { INVERIFY_IDENTIFIERS } from "../../di/inversify/inversify.types";
import type { PermissionEntity } from "../../../domain/entities/permission/PermissionEntity";
import type { UserModel } from "../../database/typeorm/models/UserModel";
import type { DocumentModel } from "../../database/typeorm/models/DocumentModel";

@injectable()
export class TypeORMPermissionRepository implements PermissionRepository {
    private repository: Repository<PermissionModel>;
    public dataSource: DataSource;

    constructor(@inject(INVERIFY_IDENTIFIERS.TypeORMDataSource) dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = dataSource.getRepository(PermissionModel);
    }

    public async grantPermission(permission: PermissionEntity): Promise<Result<Permission, Error>> {
        const entity = this.toEntity(permission);
        await this.repository.save(entity);
        return Result.Ok(this.toDomain(entity));
    }

    public async getPermissions(userId: string): Promise<Result<Permission[], Error>> {
        const entity = await this.repository.find({where: {user: {id: userId}}, relations: ['user']});
        return entity ? Result.Ok(this.toDomain(entity)) : Result.Err(new PermissionDoesNotExistError("No permissions found"));
    }

    public async revokePermission(id: string): Promise<Result<boolean, Error>> {
        if (await this.repository.exists({where:{id: id}})) {
            const res = await this.repository.delete(id);
            return Result.Ok(true);
        }
        return Result.Err(new PermissionDoesNotExistError("Permission not found"));
    }

    private toEntity(permission: Permission): PermissionModel {
        const entity = new PermissionModel();
        entity.id = permission.id;
        entity.user = {id: permission.userId} as unknown as UserModel;
        entity.creator = {id: permission.creatorId} as unknown as UserModel;
        entity.document = {id: permission.documentId} as unknown as DocumentModel;
        entity.createdAt = permission.createdAt;
        entity.permissionType = permission.permissionType;
        return entity;
    }

    private toDomain(entity: PermissionModel): Permission;
    private toDomain(entity: PermissionModel[]): Permission[];
    private toDomain(entity: PermissionModel | PermissionModel[]): Permission | Permission[] {
        if (Array.isArray(entity)) {
            return entity.map(singleEntity => ({
                id: singleEntity.id as UUID,
                userId: singleEntity.user.id as UUID,
                creatorId: singleEntity.creator.id as UUID,
                documentId: singleEntity.document.id as UUID,
                createdAt: singleEntity.createdAt,
                permissionType: singleEntity.permissionType
            }));
        }
    
        return {
            id: entity.id as UUID,
            userId: entity.user.id as UUID,
            creatorId: entity.creator.id as UUID,
            documentId: entity.document.id as UUID,
            createdAt: entity.createdAt,
            permissionType: entity.permissionType
        };
    }
}