import type { PermissionRepository } from "../../../domain/permission/port/PermissionRepository";
import { PermissionEntity } from "../../database/typeorm/entities/PermissionEntity";
import { Permission } from "../../../domain/permission/Permisson";
import { Repository} from "typeorm";
import { DataSource } from 'typeorm';
import type { CommandResult } from "../../../shared/types";
import { injectable } from "inversify";

@injectable()
export class TypeORMPermissionRepository implements PermissionRepository {
    private repository: Repository<PermissionEntity>;
    public dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = dataSource.getRepository(PermissionEntity);
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
        const entity = await this.repository.find({where: {userId: userId}});
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

    private toEntity(permission: Permission): PermissionEntity {
        const entity = new PermissionEntity();
        entity.id = permission.id;
        entity.creatorId = permission.creatorId;
        entity.userId = permission.userId;
        entity.documentId = permission.documentId;
        entity.permissionType = permission.permissionType;
        entity.createdAt = permission.createdAt;
        return entity;
    }

    private toDomain(entity: PermissionEntity): Permission;
    private toDomain(entity: PermissionEntity[]): Permission[];
    private toDomain(entity: PermissionEntity | PermissionEntity[]): Permission | Permission[] {
        if (Array.isArray(entity)) {
            return entity.map(singleEntity => new Permission(
                singleEntity.userId,
                singleEntity.creatorId,
                singleEntity.documentId,
                singleEntity.permissionType,
                singleEntity.createdAt,
                singleEntity.id
            ));
        }
    
        return new Permission(
            entity.userId,
            entity.creatorId,
            entity.documentId,
            entity.permissionType,
            entity.createdAt,
            entity.id
        );
    }
}