import type { UserRepository } from "../../../domain/entities/user/port/UserRepository";
import type { User } from "../../../domain/entities/user/User";
import { UserEntity } from "../../../domain/entities/user/UserEntity";
import { createSecretKey } from 'crypto';
import type { Hasher } from "../../ports/hasher/Hasher";
import { injectable, inject } from "inversify";
import { INVERIFY_IDENTIFIERS } from "../../../infra/di/inversify/inversify.types";
import { JoseJWTAdapter } from "../../../infra/jwt/joseAdapter";
import type { Logger } from "../../ports/logger/logger";
import type { UserRegisterDtoType, UserLoginDtoType, UserUpdateDtoType, UserGetOrDeleteDtoType } from "../../dtos/UserDtos";
import { Result, matchRes } from "joji-ct-fp";
import { UserAlreadyExistsError } from "../../errors/UserErrors";
import { UnauthorizedAccessError } from "../../errors/TokenErrors";
import { UserRole } from "../../../shared/enums/UserRole";
import type { DatabaseManager } from "../../ports/database/database";

@injectable()
export class UserService {
  constructor(
    @inject(INVERIFY_IDENTIFIERS.UserRepository) private userRepository: UserRepository,
    @inject(INVERIFY_IDENTIFIERS.Hasher) private hasher: Hasher,
    @inject(INVERIFY_IDENTIFIERS.JWT) private jwtAdapter: JoseJWTAdapter,
    @inject(INVERIFY_IDENTIFIERS.Logger) private logger: Logger,
    @inject(INVERIFY_IDENTIFIERS.DatabaseManager) private databaseManager: DatabaseManager
  ) {}

  public async registerUser(userRegisterDto: UserRegisterDtoType): Promise<Result<User, Error>> {
    this.logger.info("Registering user with email: " + userRegisterDto.email);

    const user = await this.userRepository.get(userRegisterDto.email);
    if (user.isOk()) {
      this.logger.warn("User with email already exists: " + userRegisterDto.email);
      return Result.Err(new UserAlreadyExistsError("User with this email already exists"));
    }

    const res = await (await this.hasher.hash(userRegisterDto.password))
        .flatMap((securePassword) => {
          userRegisterDto.password = securePassword;
          return UserEntity.create(userRegisterDto.email, userRegisterDto.password, userRegisterDto.name, userRegisterDto.userRole)
            .flatMap(
              async (userEntity) => (await this.userRepository.create(userEntity))
            )
        });

    return matchRes(res, {
      Ok: (res) => {
        this.logger.info("User registered successfully: " + userRegisterDto.email);
        return Result.Ok(res);
      },
      Err: (err) => {
        this.logger.error("Error registering user: " + err.message);
        return Result.Err(err);
      }
    });
  }

  public async login(userLoginDto: UserLoginDtoType): Promise<Result<string, Error>> {
    this.logger.info("User login attempt with email: " + userLoginDto.email);

    const res = await (await this.userRepository.get(userLoginDto.email))
      .flatMap(async (user) => (await this.databaseManager.query<string>("SELECT password FROM public.user_model WHERE id = $1", [user.id]))
        .flatMap(async (safePassword) => (await this.hasher.compare(userLoginDto.password, safePassword[0].password))
          .flatMap(async () => {
            const secretKey = createSecretKey(new TextEncoder().encode(process.env.JWT_SECRET))
            return await this.jwtAdapter.sign(
              { userId: user.id, role: user.userMetadata.userRole }, 
              String(process.env.JWT_ALG), 
              secretKey, 
              String(process.env.JWT_EXP_TIME))
          })));

    return matchRes(res, {
      Ok: (res) => {
        this.logger.info("User logged in successfully: " + userLoginDto.email);
        return Result.Ok(res);
      },
      Err: (err) => {
        this.logger.error("Error logging in user: " + err.message);
        return Result.Err(err);
      }
    });
  }

  public async updateUser(userUpdateDto: UserUpdateDtoType): Promise<Result<User, Error>> {
    this.logger.info("Updating user with ID: " + userUpdateDto.userId);

    const secretKey = createSecretKey(new TextEncoder().encode(process.env.JWT_SECRET));
    const res = await (await this.jwtAdapter.verify(userUpdateDto.token, secretKey))
      .flatMap((payload) => {
        if (payload.userId !== userUpdateDto.userId && payload.role !== UserRole.ADMIN) {
          this.logger.warn("Unauthorized access attempt by user ID: " + payload.userId);
          return Result.Err(new UnauthorizedAccessError("User does not have access to this resource"));
        }
        return Result.Ok(payload);
      }).flatMap(async () => (await this.userRepository.get(userUpdateDto.userId))
          .flatMap(async (user) => {
            const res = await this.databaseManager.query<string>("SELECT password FROM public.user_model WHERE id = $1", [user.id]);
            let safePassword = res.unwrap()[0].password;
            if (userUpdateDto.password) {
              const hashedPassword = await this.hasher.hash(userUpdateDto.password);
              if (hashedPassword.isErr()) {
                this.logger.error("Error hashing password for user ID: " + userUpdateDto.userId);
                return Result.Err(hashedPassword.unwrapErr());
              }
              safePassword = hashedPassword.unwrap();
            }

            if (userUpdateDto.email) {
              user.email = userUpdateDto.email;
            }
        
            if (userUpdateDto.name) {
              user.userMetadata.name = userUpdateDto.name;
            }
            return UserEntity.create(user.email, safePassword, user.userMetadata.name, user.userMetadata.userRole)
            .flatMap(
              async (userEntity) => (await this.userRepository.create(userEntity))
            )
          }
          )
        );

    return matchRes(res, {
      Ok: (res) => {
        this.logger.info("User updated successfully: " + userUpdateDto.userId);
        return Result.Ok(res);
      },
      Err: (err) => {
        this.logger.error("Error updating user: " + err.message);
        return Result.Err(err);
      }
    });
  }

  public async getUser(userGetDto: UserGetOrDeleteDtoType): Promise<Result<User, Error>> {
    this.logger.info("Fetching user with ID: " + userGetDto.userId);

    const secretKey = createSecretKey(new TextEncoder().encode(process.env.JWT_SECRET));
    const res = await (await this.jwtAdapter.verify(userGetDto.token, secretKey))
      .flatMap((payload) => {
        if (payload.userId !== userGetDto.userId && payload.role !== UserRole.ADMIN) {
          this.logger.warn("Unauthorized access attempt by user ID: " + payload.userId);
          return Result.Err(new UnauthorizedAccessError("User does not have access to this resource"));
        }
        return Result.Ok(payload);
      }).flatMap(async () => await this.userRepository.get(userGetDto.userId)
      );
  
    return matchRes(res, {
      Ok: (res) => {
        this.logger.info("User fetched successfully: " + userGetDto.userId);
        return Result.Ok(res);
      },
      Err: (err) => {
        this.logger.error("Error fetching user: " + err.message);
        return Result.Err(err);
      }
    });
  }

  public async deleteUser(userDeleteDto: UserGetOrDeleteDtoType): Promise<Result<boolean, Error>> {
    this.logger.info("Deleting user with ID: " + userDeleteDto.userId);

    const secretKey = createSecretKey(new TextEncoder().encode(process.env.JWT_SECRET));
    const res = await (await this.jwtAdapter.verify(userDeleteDto.token, secretKey))
      .flatMap((payload) => {
        if (payload.userId !== userDeleteDto.userId && payload.role !== UserRole.ADMIN) {
          this.logger.warn("Unauthorized access attempt by user ID: " + payload.userId);
          return Result.Err(new UnauthorizedAccessError("User does not have access to this resource"));
        }
        return Result.Ok(payload);
      }).flatMap(async () => await this.userRepository.delete(userDeleteDto.userId)
      );

    return matchRes(res, {
      Ok: (res) => {
        this.logger.info("User deleted successfully: " + userDeleteDto.userId);
        return Result.Ok(res);
      },
      Err: (err) => {
        this.logger.error("Error deleting user: " + err.message);
        return Result.Err(err);
      }
    });
  }
}
