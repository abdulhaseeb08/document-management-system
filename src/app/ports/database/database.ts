import { Table } from "typeorm";
import { Result } from "joji-ct-fp";

export interface DatabaseManager {
    query<T>(query: string, parameters?: any[]): Promise<Result<Array<Record<string, T>>, Error>>;
    createSchema(schemaName: string): Promise<Result<boolean, Error>>;
    createTable(table: Table): Promise<Result<boolean, Error>>;
}