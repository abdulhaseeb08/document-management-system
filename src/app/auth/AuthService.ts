import type { UserRepository } from "../../domain/user/port/UserRepository";
import { UserRole } from "../../shared/enums/UserRole";
import type { UserCredentials } from "../../domain/user/UserCredentials";
import { User } from "../../domain/user/User";
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

  public async registerUser(userCredentials: UserCredentials, role: UserRole): Promise<CommandResult<string>> {
    const hashedPassword = await this.hasher.hash(userCredentials.password);
    if (hashedPassword.success) {
      userCredentials.password = hashedPassword.value;
      const user = new User(userCredentials, role);
      const res = await this.userRepository.create(user);
      if (res.success) {
        return {success: true, value: user.id};
      } else {
        return {success: false, error: res.error};
      }
    }
    return {success: false, error: hashedPassword.error}
  }

  public async login(userCredentials: UserCredentials): Promise<CommandResult<string>> {
    const user = await this.userRepository.get(userCredentials.email);
    if (!user) {
      return {success: false, error: "No user with given email found"};
    }

    const validPassword = await this.hasher.compare(userCredentials.password, user.password);
    if (!validPassword) {
      return {success: false, error: "Incorrect password"};
    }

    const SECRET = createSecretKey(
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const token = await this.jwtAdapter.sign({ userId: user.id, role: user.userRole }, String(process.env.JWT_ALG) , SECRET, String(process.env.JWT_EXP_TIME));
    if (token.success) {
      return {success: true, value: token.value};
    }
    return {success: false, error: token.error};
  }
}
