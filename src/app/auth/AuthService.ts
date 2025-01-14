import type { UserRepository } from "../../domain/entities/user/port/UserRepository";
import { UserRole } from "../../shared/enums/UserRole";
import type { User } from "../../domain/entities/user/User";
import { UserEntity } from "../../domain/entities/user/UserEntity";
import { createSecretKey } from 'crypto';
import type { Hasher } from "../hasher/port/Hasher";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../infra/di/inversify/inversify.types";
import { JoseJWTAdapter } from "../../infra/jwt/joseAdapter";
import type { CommandResult } from "../../shared/types";

@injectable()
export class AuthService {
  constructor(
    @inject(INVERIFY_IDENTIFIERS.UserRepository) private userRepository: UserRepository,
    @inject(INVERIFY_IDENTIFIERS.Hasher) private hasher: Hasher,
    @inject(INVERIFY_IDENTIFIERS.JWT) private jwtAdapter: JoseJWTAdapter
  ) {}

  public async registerUser(user: User): Promise<CommandResult<string>> {
    const hashedPassword = await this.hasher.hash(user.password);
    if (hashedPassword.success) {
      user.password = hashedPassword.value;
      const userRes = UserEntity.create(user);
      if (userRes.success) {
        const res = await this.userRepository.create(user);
        if (res.success) {
          return {success: true, value: user.id};
        } else {
          return {success: false, error: res.error};
        }
      }
      return {success: false, error: userRes.error};

    } else {
      return {success: false, error: hashedPassword.error};
    }
  }

  public async login(user: User): Promise<CommandResult<string>> {
    const res = await this.userRepository.get(user.email);
    if (!res) {
      return {success: false, error: Error("No user with given email found")};
    }

    const validPassword = await this.hasher.compare(user.password, user.password);
    if (!validPassword) {
      return {success: false, error: Error("Incorrect password")};
    }

    const SECRET = createSecretKey(
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const token = await this.jwtAdapter.sign({ userId: user.id, role: user.userMetadata.userRole }, String(process.env.JWT_ALG) , SECRET, String(process.env.JWT_EXP_TIME));
    if (token.success) {
      return {success: true, value: token.value};
    }
    return {success: false, error: token.error};
  }
}
