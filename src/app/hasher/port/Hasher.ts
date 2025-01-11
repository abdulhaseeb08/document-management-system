import type { CommandResult } from "../../../shared/types"

export interface Hasher {
    hash(password: string): Promise<CommandResult<string>>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}