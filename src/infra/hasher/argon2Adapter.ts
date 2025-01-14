import argon2 from "argon2";
import type { Hasher } from "../../app/services/hasher/port/Hasher";
import type { CommandResult } from "../../shared/types";
import { injectable } from "inversify";

@injectable()
export class Argon2Adpater implements Hasher {
    
    public async hash(password: string): Promise<CommandResult<string>> {
        try {
            const hashedPassword = await argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 19,
                timeCost: 2,
                parallelism: 1,
            });
            return {success: true, value: hashedPassword};
        } catch (err) {
            return {success: false, error: err  as Error};
        }
    }

    public async compare(password: string, hashedPassword: string): Promise<boolean> {
        try {
            return await argon2.verify(hashedPassword, password);
        } catch (err) {
            return false;
        }
    }
}