import type { JWTAuth } from "../../app/ports/jwt/jwt";
import type { JWTPayload } from "jose";
import { KeyObject, createSecretKey } from 'crypto';
import { SignJWT, jwtVerify } from "jose";
import { injectable } from "inversify";
import { Result } from "joji-ct-fp";
import { InvalidTokenError } from "../../app/errors/TokenErrors";

@injectable()
export class JoseJWTAdapter implements JWTAuth {

    public createSecretKey(): KeyObject {
        return createSecretKey(new TextEncoder().encode(process.env.JWT_SECRET));
    }

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
            return Result.Err(new InvalidTokenError('Invalid or Expired Token'));
        }
    }
}