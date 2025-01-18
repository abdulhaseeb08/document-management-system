import type { DatabaseManager } from "../../../app/ports/database/database";
import { Table } from "typeorm";
import { DataSource } from 'typeorm';
import type {QueryRunner} from 'typeorm';
import { Result } from "joji-ct-fp";
import { inject, injectable } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../di/inversify/inversify.types";

@injectable()
export class TypeORMDatabaseManager implements DatabaseManager {
    public queryRunner: QueryRunner;

    constructor(@inject(INVERIFY_IDENTIFIERS.TypeORMDataSource) dataSource: DataSource) {
        this.queryRunner = dataSource.createQueryRunner()
    }

    public async query<T>(query: string, parameters?: any[]): Promise<Result<Array<Record<string, T>>, Error>> {
        await this.queryRunner.connect();
        const res = await this.queryRunner.query(query, parameters, true);
        await this.queryRunner.release();
        if (res.affected === 0) {
            return Result.Err(new Error("No records found"));
        }
        return Result.Ok(res.records);
    }

    public async createSchema(schemaName: string): Promise<Result<boolean, Error>> {
        await this.queryRunner.connect();
        await this.queryRunner.createSchema(schemaName, true);
        await this.queryRunner.release();
        return Result.Ok(true);
    }

    public async createTable(table: Table): Promise<Result<boolean, Error>> {
        await this.queryRunner.connect();
        await this.queryRunner.createTable(table, true);
        await this.queryRunner.release();
        return Result.Ok(true);
    }
}