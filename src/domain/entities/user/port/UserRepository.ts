import type { User } from "../User";
import { UserEntity } from "../UserEntity";
import { Result } from "joji-ct-fp";

export interface UserRepository {
    create(user: UserEntity): Promise<Result<User, Error>>;
    update(user: UserEntity): Promise<Result<User, Error>>;
    get(idOrEmail: string): Promise<Result<User, Error>>;
    delete(id: string): Promise<Result<boolean, Error>>;
}