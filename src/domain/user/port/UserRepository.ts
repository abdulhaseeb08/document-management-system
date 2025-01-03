import { User } from "../User";
import type { UserCredentials } from "../UserCredentials";

export interface UserRepository {
    create(user: User): Promise<void>;
    update(user: User, userCredentials: UserCredentials): Promise<void>;
    get(idOrEmail: string): Promise<User | null>;
    delete(id: string): Promise<void>;
}