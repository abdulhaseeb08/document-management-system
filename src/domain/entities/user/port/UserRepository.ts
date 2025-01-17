import type { User } from "../User";
import type { CommandResult } from "../../../../shared/types";
import { Result } from "joji-ct-fp";

export interface UserRepository {
    create(user: User): Promise<Result<User, Error>>;
    update(user: User): Promise<Result<User, Error>>;
    get(idOrEmail: string): Promise<Result<User, Error>>;
    delete(id: string): Promise<Result<boolean, Error>>;
}