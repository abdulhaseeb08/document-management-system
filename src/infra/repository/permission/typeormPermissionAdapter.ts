import type { PermissionRepository } from "../../../domain/entities/permission/port/PermissionRepository";
import { PermissionModel } from "../../database/typeorm/models/PermissionModel";
import type { Permission } from "../../../domain/entities/permission/Permisson";
import { Repository} from "typeorm";
import { DataSource } from 'typeorm';
import type { CommandResult, UUID } from "../../../shared/types";
import { injectable } from "inversify";

@injectable()
export class TypeORMPermissionRepository implements PermissionRepository {
    private repository: Repository<PermissionModel>;
    public dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = dataSource.getRepository(PermissionModel);
    }

    public async grantPermission(permission: Permission): Promise<CommandResult<string>> {
        try {
            const entity = this.toEntity(permission);
            await this.repository.save(entity);
            return { success: true, value: entity.id };
        } catch (err) {
            return { success: false, error: err as Error };
        }
    }

    public async getPermissions(userId: string): Promise<Permission[] | null> {
        const entity = await this.repository.find({where: {user: userId}});
        return entity ? this.toDomain(entity) : null;
    }

    public async revokePermission(id: string): Promise<CommandResult<string>> {
        try {
            if (await this.repository.exists({where:{id: id}})) {
                const res = await this.repository.delete(id);
                return { success: true, value: `Rows affected: ${res.affected}`};
            }
            return { success: true, value: `IdRows affected: 0`};
        } catch (err) {
            return { success: false, error: err as Error };
        }
    }

    private toEntity(permission: Permission): PermissionModel {
        const entity = new PermissionModel();
        entity.id = permission.id;
        entity.user = permission.userId;
        entity.creator = permission.creatorId;
        entity.document = permission.documentId;
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
                userId: singleEntity.user as UUID,
                creatorId: singleEntity.creator as UUID,
                documentId: singleEntity.document as UUID,
                createdAt: singleEntity.createdAt,
                permissionType: singleEntity.permissionType
            }));
        }
    
        return {
            id: entity.id as UUID,
            userId: entity.user as UUID,
            creatorId: entity.creator as UUID,
            documentId: entity.document as UUID,
            createdAt: entity.createdAt,
            permissionType: entity.permissionType
        };
    }
}