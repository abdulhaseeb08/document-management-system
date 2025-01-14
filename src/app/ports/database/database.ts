import { Table } from "typeorm";

export interface DatabaseManager {
    query(query: string, parameters?: any[]): Promise<Array<Record<string, unknown>> | null>;
    createSchema(schemaName: string): Promise<boolean>;
    createTable(table: Table): Promise<boolean>;
}