import { injectable, inject } from "inversify";
import type { UserDAO } from "../../../app/ports/user/UserDAO";
import type { DatabaseManager } from "../../../app/ports/database/database";
import { INVERIFY_IDENTIFIERS } from "../../di/inversify/inversify.types";
import { matchRes, Result } from "joji-ct-fp";
import type { UUID } from "../../../shared/types";

@injectable()
export class PostgresUserDAOAdapter implements UserDAO {
    constructor(@inject(INVERIFY_IDENTIFIERS.DatabaseManager) private databaseService: DatabaseManager) {}

    async getUserPassword(userId: UUID): Promise<Result<string, Error>> {
        const query = "SELECT password FROM public.user_model WHERE id = $1";
        const res= (await this.databaseService.query<string>(query, [userId]))
                .map((result) => result[0].password);
        return matchRes(res, {
            Ok: (password) => Result.Ok(password),
            Err: (error) => Result.Err(error)
        });
    }
}
