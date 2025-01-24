import { Result } from "joji-ct-fp";

export interface DatabaseManager {
    query<T>(query: string, parameters?: any[]): Promise<Result<Array<Record<string, T>>, Error>>;
}