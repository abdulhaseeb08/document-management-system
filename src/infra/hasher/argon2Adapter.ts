import argon2 from "argon2";
import type { Hasher } from "../../app/ports/hasher/Hasher";
import { inject, injectable } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../di/inversify/inversify.types";
import type { Logger } from "../../app/ports/logger/logger";
import { Result } from "joji-ct-fp";
import { IncorrectPasswordError } from "../../app/errors/UserErrors";

@injectable()
export class Argon2Adpater implements Hasher {

    constructor(@inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger) {}
    
    public async hash(password: string): Promise<Result<string, Error>> {
        try {
            const hashedPassword = await argon2.hash(password);
            return Result.Ok(hashedPassword);
        } catch (err) {
            return Result.Err(err as Error);
        }
    }

    public async compare(password: string, hashedPassword: string): Promise<Result<boolean, Error>> {
        const isSame = await argon2.verify(hashedPassword, password);
        if (!isSame) {
            return Result.Err(new IncorrectPasswordError("Password is incorrect"));
        }
        return Result.Ok(isSame);
    }
}