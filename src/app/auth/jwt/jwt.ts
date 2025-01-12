import { KeyObject} from 'crypto';
import type { JWTPayload } from 'jose';
import type { CommandResult } from "../../../shared/types";

export interface JWTAuth {
    sign(payload:Record<string, unknown>, alg: string, secret: KeyObject, expTime: string): Promise<CommandResult<string>>;
    verify(token: string, secret: KeyObject): Promise<CommandResult<JWTPayload>>;
}