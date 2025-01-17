import type { UserRepository } from "../../../domain/entities/user/port/UserRepository";
import type { User } from "../../../domain/entities/user/User";
import { UserEntity } from "../../../domain/entities/user/UserEntity";
import { createSecretKey } from 'crypto';
import type { Hasher } from "../../ports/hasher/Hasher";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../../infra/di/inversify/inversify.types";
import { JoseJWTAdapter } from "../../../infra/jwt/joseAdapter";
import type { Logger } from "../../ports/logger/logger";
import type { UserRegisterDtoType } from "../../dtos/UserDtos";
import { Result, matchRes } from "joji-ct-fp";

@injectable()
export class AuthService {
  constructor(
    @inject(INVERIFY_IDENTIFIERS.UserRepository) private userRepository: UserRepository,
    @inject(INVERIFY_IDENTIFIERS.Hasher) private hasher: Hasher,
    @inject(INVERIFY_IDENTIFIERS.JWT) private jwtAdapter: JoseJWTAdapter,
    @inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger
  ) {}

  public async registerUser(userRegisterDto: UserRegisterDtoType): Promise<Result<User, Error>> {

    const res = await (await this.userRepository.get(userRegisterDto.email))
      .flatMap(async () => (await this.hasher.hash(userRegisterDto.password))
        .flatMap((securePassword) => {
          userRegisterDto.password = securePassword;
          return UserEntity.create(userRegisterDto.email, userRegisterDto.password, userRegisterDto.name, userRegisterDto.userRole)
            .flatMap(
              async (userEntity) => (await this.userRepository.create(userEntity.serialize()))
            )
        })
      );

      return matchRes(res, {
        Ok: (res) => Result.Ok(res),
        Err: (err) => Result.Err(err)
      })

  }

  public async login(user: User): Promise<Result<string, Error>> {

    const res = await (await this.userRepository.get(user.email))
      .flatMap(async () => (await this.hasher.compare(user.password, user.password))
        .flatMap(() => Result.Ok(createSecretKey(new TextEncoder().encode(process.env.JWT_SECRET)))
          .flatMap(async (secretKey) => (await this.jwtAdapter.sign(
            { userId: user.id, role: user.userMetadata.userRole }, 
            String(process.env.JWT_ALG), 
            secretKey, 
            String(process.env.JWT_EXP_TIME)))
          )
        )
      );

      return matchRes(res, {
        Ok: (res) => Result.Ok(res),
        Err: (err) => Result.Err(err)
      })
  }
}