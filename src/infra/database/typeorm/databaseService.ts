import type { DatabaseManager } from "../../../app/ports/database/database";
import { Table } from "typeorm";
import { DataSource } from 'typeorm';
import type {QueryRunner} from 'typeorm';

export class TypeORMDatabaseManager implements DatabaseManager {
    public queryRunner: QueryRunner;

    constructor(dataSource: DataSource) {
        this.queryRunner = dataSource.createQueryRunner()
    }

    public async query(query: string, parameters?: any[]): Promise<Array<Record<string, unknown>> | null> {
        await this.queryRunner.connect();
        const res = await this.queryRunner.query(query, parameters, true);
        await this.queryRunner.release();
        if (res.affected === 0) {
            return null;
        }
        return res.records;
    }

    public async createSchema(schemaName: string): Promise<boolean> {
        await this.queryRunner.connect();
        await this.queryRunner.createSchema(schemaName, true);
        await this.queryRunner.release();
        return true;
    }

    public async createTable(table: Table): Promise<boolean> {
        await this.queryRunner.connect();
        await this.queryRunner.createTable(table, true);
        await this.queryRunner.release();
        return true;
    }
}