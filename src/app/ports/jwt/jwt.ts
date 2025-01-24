import { KeyObject} from 'crypto';
import type { JWTPayload } from '../../../shared/types';
import { Result } from 'joji-ct-fp';

export interface JWTAuth {
    createSecretKey(): KeyObject;
    sign(payload:Record<string, unknown>, alg: string, secret: KeyObject, expTime: string): Promise<Result<string, Error>>;
    verify(token: string, secret: KeyObject): Promise<Result<JWTPayload, Error>>;
}