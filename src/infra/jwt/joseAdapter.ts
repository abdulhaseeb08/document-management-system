import type { JWTAuth } from "../../app/ports/jwt/jwt";
import type { JWTPayload } from "jose";
import type { CommandResult } from "../../shared/types";
import { KeyObject} from 'crypto';
import { SignJWT, jwtVerify } from "jose";
import { injectable } from "inversify";
import { Result } from "joji-ct-fp";

@injectable()
export class JoseJWTAdapter implements JWTAuth {

    public async sign(payload:Record<string, unknown>, alg: string, secret: KeyObject, expTime: string): Promise<Result<string, Error>> {
        try {
            const token = await new SignJWT(payload)
                            .setIssuedAt()
                            .setProtectedHeader({alg: `${alg}`})
                            .setExpirationTime(expTime)
                            .sign(secret)
            return Result.Ok(token);
            
        } catch (err) {
            return Result.Err(err as Error);
        }
    }

    public async verify(token: string, secret: KeyObject): Promise<Result<JWTPayload, Error>> {
        try {
            const { payload } = await jwtVerify(token, secret);
            return Result.Ok(payload);
        } catch (err) {
            return Result.Err(Error('Opppsie'));
        }
    }
}