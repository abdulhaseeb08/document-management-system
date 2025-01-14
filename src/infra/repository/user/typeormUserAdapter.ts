import type { UserRepository } from "../../../domain/entities/user/port/UserRepository";
import { UserModel } from "../../database/typeorm/models/UserModel";
import type { User } from "../../../domain/entities/user/User";
import { Repository} from "typeorm";
import { DataSource } from 'typeorm';
import type { CommandResult, UUID } from "../../../shared/types";
import { injectable } from "inversify";

@injectable()
export class TypeORMUserRepository implements UserRepository {
    private repository: Repository<UserModel>;
    public dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = dataSource.getRepository(UserModel);
    }

    public async create(user: User): Promise<CommandResult<string>> {
        try {
            const entity = this.toEntity(user);
            await this.repository.save(entity);
            return { success: true, value: entity.id };
        } catch (err) {
            return { success: false, error: err as Error };
        }
    }

    public async update(user: User): Promise<CommandResult<string>> {
        try {
            const entity = this.toEntity(user);
            await this.repository.save(entity);
            return { success: true, value: entity.id };
        } catch (err) {
            return { success: false, error: err as Error };
        }
    }

    public async get(id: string): Promise<User | null> {
        const entity = await this.repository.findOne({where: {id: id}});
        return entity ? this.toDomain(entity) : null;
    }

    public async delete(id: string): Promise<CommandResult<string>> {
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

    private toEntity(user: User): UserModel {
        const entity = new UserModel();
        entity.id = user.id;
        entity.email = user.email;
        entity.password = user.password;
        entity.createdAt = user.createdAt;
        entity.updatedAt = user.userMetadata.updatedAt;
        entity.userRole = user.userMetadata.userRole;
        entity.updatedBy = user.updatedBy;
        entity.name = user.userMetadata.name;
        return entity;
    }

    private toDomain(entity: UserModel): User{
        return {
            id: entity.id as UUID,
            createdAt: entity.createdAt,
            email: entity.email,
            password: entity.password,
            userMetadata: {
                name: entity.name,
                updatedAt: entity.updatedAt,
                userRole: entity.userRole
            },
            updatedBy: entity.updatedBy as UUID
        };
    }
}