import type { User } from "../User";
import type { UserMetadata } from "../../../valueObjects/UserMetadata";
import type { CommandResult } from "../../../../shared/types";

export interface UserRepository {
    create(user: User): Promise<CommandResult<string>>;
    update(userMetadata: UserMetadata): Promise<CommandResult<string>>;
    get(idOrEmail: string): Promise<User | null>;
    delete(id: string): Promise<CommandResult<string>>;
}