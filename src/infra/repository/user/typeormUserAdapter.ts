import type { UserRepository } from "../../../domain/user/port/UserRepository";
import { UserEntity } from "../../database/typeorm/entities/UserEntity";
import { User } from "../../../domain/user/User";
import type { UserCredentials } from "../../../domain/user/UserCredentials";
import { Repository} from "typeorm";
import { DataSource } from 'typeorm';
import type { CommandResult } from "../../../shared/types";
import { injectable } from "inversify";

@injectable()
export class TypeORMUserRepository implements UserRepository {
    private repository: Repository<UserEntity>;
    public dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = dataSource.getRepository(UserEntity);
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

    private toEntity(user: User): UserEntity {
        const entity = new UserEntity();
        entity.id = user.id;
        entity.email = user.email;
        entity.password = user.password;
        entity.createdAt = user.createdAt;
        entity.updatedAt = user.updatedAt;
        return entity;
    }

    private toDomain(entity: UserEntity): User{
        return new User(
            {
                email: entity.email,
                password: entity.password
            },
            entity.userRole
        );
    }
}