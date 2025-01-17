import { Result } from "joji-ct-fp";

export interface Hasher {
    hash(password: string): Promise<Result<string, Error>>;
    compare(password: string, hashedPassword: string): Promise<Result<boolean, Error>>;
}