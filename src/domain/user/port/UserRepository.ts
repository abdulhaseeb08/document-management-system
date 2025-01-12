import { User } from "../User";
import type { UserCredentials } from "../UserCredentials";
import type { CommandResult } from "../../../shared/types";

export interface UserRepository {
    create(user: User): Promise<CommandResult<string>>;
    update(user: User, userCredentials: UserCredentials): Promise<CommandResult<string>>;
    get(idOrEmail: string): Promise<User | null>;
    delete(id: string): Promise<CommandResult<string>>;
}