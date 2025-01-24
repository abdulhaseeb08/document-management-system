import type { UserRepository } from "../../../domain/entities/user/port/UserRepository";
import { UserModel } from "../../database/typeorm/models/UserModel";
import type { User } from "../../../domain/entities/user/User";
import { Repository} from "typeorm";
import { DataSource } from 'typeorm';
import type { UUID } from "../../../shared/types";
import { UserEntity } from "../../../domain/entities/user/UserEntity";
import { injectable, inject } from "inversify";
import { matchRes, Result } from "joji-ct-fp";
import { INVERIFY_IDENTIFIERS } from "../../di/inversify/inversify.types";
import { UserDoesNotExistError } from "../../../app/errors/UserErrors";

@injectable()
export class TypeORMUserRepository implements UserRepository {
    private repository: Repository<UserModel>;
    private dataSource: DataSource;

    constructor(@inject(INVERIFY_IDENTIFIERS.TypeORMDataSource) dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = dataSource.getRepository(UserModel);
    }

    async createConnection() {
        if (!this.dataSource.isInitialized) {
            await this.dataSource.initialize();
        }
    }

    async closeConnection() {
        if (this.dataSource.isInitialized) {
            await this.dataSource.destroy();
        }
    }

    public async create(user: UserEntity): Promise<Result<User, Error>> {
        const entity = this.toEntity(user);
        await this.repository.save(entity);
        return Result.Ok(this.toDomain(entity));
    }

    public async update(user: UserEntity): Promise<Result<User, Error>> {
        const entity = this.toEntity(user);
        await this.repository.save(entity);
        return Result.Ok(this.toDomain(entity));
    }

    public async get(id: string): Promise<Result<User, Error>> {
        if (id.includes('@')) {
            const entity = await this.repository.findOne({where: {email: id}});

            return entity ? Result.Ok(this.toDomain(entity)) : Result.Err(new UserDoesNotExistError("User not found"));
        }
        const entity = await this.repository.findOne({where: {id: id}});
        return entity ? Result.Ok(this.toDomain(entity)) : Result.Err(new UserDoesNotExistError("User not found"));
    }

    public async delete(id: string): Promise<Result<boolean, Error>> {
        const res = await (await this.get(id))
            .flatMap(async () => Result.Ok(await this.repository.delete(id)))
        return matchRes(res, {
            Ok: () => Result.Ok(true),
            Err: (err) => Result.Err(err)
        });
    }

    private toEntity(user: UserEntity): UserModel {
        const entity = new UserModel();
        entity.id = user.id?? "No Id";
        entity.email = user.email;
        entity.password = user.getPassword();
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
            userMetadata: {
                name: entity.name,
                updatedAt: entity.updatedAt,
                userRole: entity.userRole
            },
            updatedBy: entity.updatedBy as UUID
        };
    }
}