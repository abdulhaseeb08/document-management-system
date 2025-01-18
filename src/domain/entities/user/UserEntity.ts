import type { UUID } from "../../../shared/types";
import type { UserMetadata } from "../../valueObjects/UserMetadata";
import type { User } from "./User";
import type { UserRole } from "../../../shared/enums/UserRole";
import { Result, matchRes } from "joji-ct-fp";
import { validateEmail, validateString, validateUUID } from "../../schema/Validatiors";
import {validateUser} from "../../schema/UserSchema";

export class UserEntity implements User {
    readonly id: UUID;
    readonly createdAt: Date;
    email: string;
    private password: string;
    updatedBy: UUID;
    userMetadata: UserMetadata;

    private constructor(email: string, password: string, name: string, userRole: UserRole) {
        this.id = crypto.randomUUID() as UUID;
        this.email = email;
        this.password = password;
        this.userMetadata = {
            name: name,
            updatedAt: new Date(),
            userRole: userRole,
          };
        this.createdAt = new Date();
        this.updatedBy = this.id;
    }

    public static create(email: string, password: string, name: string, userRole: UserRole): Result<UserEntity, Error> {
        const userEntity = new UserEntity(email, password, name, userRole);
        const validation = validateUser(userEntity.serialize(), password);
        return matchRes(validation, {
            Ok: () => Result.Ok(userEntity),
            Err: (err) => Result.Err(err)
        })
    }

    public setEmail(userId: UUID, email: string): Result<string, Error> {
        const emailValidation = validateEmail(email);
        const userIdValidation = validateUUID(userId);
        return matchRes(emailValidation, {
            Ok: () => matchRes(userIdValidation, {
                Ok: () => {
                    this.email = email;
                    this.userMetadata.updatedAt = new Date();
                    this.updatedBy = userId;
                    return Result.Ok("updated");
                },
                Err: (err) => Result.Err(err)
            }),
            Err: (err) => Result.Err(err)
        });
    }

    public setPassword(userId: UUID, password: string): Result<string, Error> {
        const passwordValidation = validateString(password, 100);
        const userIdValidation = validateUUID(userId);
        
        return matchRes(passwordValidation, {
            Ok: () => matchRes(userIdValidation, {
                Ok: () => {
                    this.password = password;
                    this.userMetadata.updatedAt = new Date();
                    this.updatedBy = userId;
                    return Result.Ok("updated");
                },
                Err: (err) => Result.Err(err)
            }),
            Err: (err) => Result.Err(err)
        });
    }

    public setUserName(userId: UUID, name: string): Result<string, Error> {
        const nameValidation = validateString(name, 50);
        const userIdValidation = validateUUID(userId);
        
        return matchRes(nameValidation, {
            Ok: () => matchRes(userIdValidation, {
                Ok: () => {
                    this.userMetadata.name = name;
                    this.userMetadata.updatedAt = new Date();
                    this.updatedBy = userId;
                    return Result.Ok("updated");
                },
                Err: (err) => Result.Err(err)
            }),
            Err: (err) => Result.Err(err)
        });
    }

    public setUserRole(userId: UUID, userRole: UserRole): Result<string, Error> {
        const userIdValidation = validateUUID(userId);
        
        return matchRes(userIdValidation, {
            Ok: () => {
                this.userMetadata.userRole = userRole;
                this.userMetadata.updatedAt = new Date();
                this.updatedBy = userId;
                return Result.Ok("updated");
            },
            Err: (err) => Result.Err(err)
        });
    }

    public getId(): UUID {
        return this.id;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }

    public getUserMetadata(): UserMetadata {
        return this.userMetadata;
    }

    public getLastUpdatedBy(): UUID {
        return this.updatedBy;
    }

    public getUserName(): string {
        return this.userMetadata.name;
    }

    public getUserCreateDate(): Date {
        return this.createdAt;
    }

    public getLastUpdatedAt(): Date {
        return this.userMetadata.updatedAt;
    }

    public getUserRole(): UserRole {
        return this.userMetadata.userRole;
    }

    public serialize(): User {
        return {
           id: this.id,
           email: this.email,
           createdAt: this.createdAt,
           userMetadata: this.userMetadata,
           updatedBy: this.updatedBy
        };
    }
}