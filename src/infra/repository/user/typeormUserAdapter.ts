import type { UserRepository } from "../../../domain/entities/user/port/UserRepository";
import { UserModel } from "../../database/typeorm/models/UserModel";
import type { User } from "../../../domain/entities/user/User";
import { Repository} from "typeorm";
import { DataSource } from 'typeorm';
import type { CommandResult, UUID } from "../../../shared/types";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../di/inversify/inversify.types";

@injectable()
export class TypeORMUserRepository implements UserRepository {
    private repository: Repository<UserModel>;
    public dataSource: DataSource;

    constructor(@inject(INVERIFY_IDENTIFIERS.TypeORMDataSource) dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = dataSource.getRepository(UserModel);
    }

    async createConnection() {
        await this.dataSource.initialize();
    }

    async closeConnection() {
        await this.dataSource.destroy();
    }

    public async create(user: User): Promise<CommandResult<string>> {
        try {
            const entity = this.toEntity(user);
            await this.createConnection();
            await this.repository.save(entity);
            await this.closeConnection();
            return { success: true, value: entity.id };
        } catch (err) {
            return { success: false, error: err as Error };
        }
    }

    public async update(user: User): Promise<CommandResult<string>> {
        try {
            const entity = this.toEntity(user);
            this.createConnection();
            await this.repository.save(entity);
            this.closeConnection();
            return { success: true, value: entity.id };
        } catch (err) {
            return { success: false, error: err as Error };
        }
    }

    public async get(id: string): Promise<User | null> {
        this.createConnection();
        const entity = await this.repository.findOne({where: {id: id}});
        this.closeConnection();
        return entity ? this.toDomain(entity) : null;
    }

    public async delete(id: string): Promise<CommandResult<string>> {
        try {
            this.createConnection();
            if (await this.repository.exists({where:{id: id}})) {
                const res = await this.repository.delete(id);
                this.closeConnection();
                return { success: true, value: `Rows affected: ${res.affected}`};
            }
            return { success: true, value: `IdRows affected: 0`};
        } catch (err) {
            return { success: false, error: err as Error };
        }
    }

    private toEntity(user: User): UserModel {
        const entity = new UserModel();
        entity.id = user.id?? "No Id";
        entity.email = user.email;
        entity.password = user.password;
        entity.createdAt = user.createdAt?? new Date();
        entity.updatedAt = user.userMetadata.updatedAt;
        entity.userRole = user.userMetadata.userRole;
        entity.updatedBy = user.updatedBy?? "No id";
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