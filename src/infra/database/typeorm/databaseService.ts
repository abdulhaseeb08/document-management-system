import type { DatabaseManager } from "../../../app/ports/database/database";
import { Table } from "typeorm";
import { DataSource } from 'typeorm';
import type {QueryRunner} from 'typeorm';
import { Result } from "joji-ct-fp";
import { inject, injectable } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../di/inversify/inversify.types";

@injectable()
export class TypeORMDatabaseManager implements DatabaseManager {
    private dataSource: DataSource;

    constructor(@inject(INVERIFY_IDENTIFIERS.TypeORMDataSource) dataSource: DataSource) {
        this.dataSource = dataSource
    }

    async createConnection(): Promise<QueryRunner> {
        await this.dataSource.initialize();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        return queryRunner;
    }

    async closeConnection(queryRunner: QueryRunner) {
        await queryRunner.release();
        await this.dataSource.destroy();
    }

    public async query<T>(query: string, parameters?: any[]): Promise<Result<Array<Record<string, T>>, Error>> {
        const queryRunner = await this.createConnection();
        const res = await queryRunner.query(query, parameters, true);
        await this.closeConnection(queryRunner);
        if (res.affected === 0) {
            return Result.Err(new Error("No records found"));
        }
        return Result.Ok(res.records);
    }

    public async createSchema(schemaName: string): Promise<Result<boolean, Error>> {
        const queryRunner = await this.createConnection();
        await queryRunner.createSchema(schemaName, true);
        await this.closeConnection(queryRunner);
        return Result.Ok(true);
    }

    public async createTable(table: Table): Promise<Result<boolean, Error>> {
        const queryRunner = await this.createConnection();
        await queryRunner.createTable(table, true);
        await this.closeConnection(queryRunner);
        return Result.Ok(true);
    }
}