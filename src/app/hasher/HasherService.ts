import type { Hasher } from "./port/Hasher";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../infra/di/inversify/inversify.types";
import type { CommandResult } from "../../shared/types";

@injectable()
export class HasherService {
    constructor(@inject(INVERIFY_IDENTIFIERS.Hasher) private hasher: Hasher) {}

    public async hashPassword(password: string): Promise<CommandResult<string>> {
        return await this.hasher.hash(password);
    }

    public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await this.comparePassword(password, hashedPassword);
    }

}