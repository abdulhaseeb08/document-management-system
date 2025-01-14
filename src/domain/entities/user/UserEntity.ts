import type { UUID } from "../../../shared/types";
import { UserMetadataSchema } from "../../schema/UserSchema";
import { UserSchema } from "../../schema/UserSchema";
import type { CommandResult } from "../../../shared/types";
import type { UserMetadata } from "../../valueObjects/UserMetadata";
import type { User } from "./User";
import type { UserRole } from "../../../shared/enums/UserRole";

export class UserEntity implements User {
    readonly id: UUID;
    readonly createdAt: Date;
    email: string;
    password: string;
    updatedBy: UUID;
    userMetadata: UserMetadata;

    private constructor(email: string, password: string, userMetadata: UserMetadata) {
        this.id = crypto.randomUUID() as UUID;
        this.email = email;
        this.password = password;
        this.userMetadata = userMetadata;
        this.createdAt = new Date();
        this.updatedBy = this.id;
    }

    public static create(email: string, password: string, userMetadata: UserMetadata): CommandResult<UserEntity> {
        const userEntity = new UserEntity(email, password, userMetadata);
        const validation = UserMetadataSchema.safeParse(userEntity.serialize());
        if (validation.success) {
            return {success: true, value: userEntity};
        }
        return {success: false, error: Error(validation.error.message)};
    }

    public setEmail(userId: UUID, email: string): CommandResult<string> {
        const emailValidation = UserSchema.shape.email.safeParse(email);
        const userIdValidation = UserSchema.shape.updatedBy.safeParse(userId);
        if (emailValidation.success && userIdValidation.success) {
            this.email = email;
            this.userMetadata.updatedAt = new Date();
            this.updatedBy = userId;
            return {success: true, value: "updated"};
        }
        return {success: false, error: Error(emailValidation.error?.message || userIdValidation.error?.message)};
    }

    public setPassword(userId: UUID, password: string): CommandResult<string> {
        const passwordValidation = UserSchema.shape.password.safeParse(password);
        const userIdValidation = UserSchema.shape.updatedBy.safeParse(userId);
        if (passwordValidation.success && userIdValidation.success) {
            this.password = password;
            this.userMetadata.updatedAt = new Date();
            this.updatedBy = userId;
            return {success: true, value: "updated"};
        }
        return {success: false, error: Error(passwordValidation.error?.message || userIdValidation.error?.message)};
    }

    public setUserName(userId: UUID, name: string): CommandResult<string> {
        const nameValidation = UserMetadataSchema.shape.name.safeParse(name);
        const userIdValidation = UserSchema.shape.updatedBy.safeParse(userId);
        if (nameValidation.success && userIdValidation.success) {
            this.userMetadata.name = name;
            this.userMetadata.updatedAt = new Date();
            this.updatedBy = userId;
            return {success: true, value: "updated"};
        }
        return {success: false, error: Error(nameValidation.error?.message || userIdValidation.error?.message)};
    }

    public setUserRole(userId: UUID, userRole: UserRole): CommandResult<string> {
        const userRoleValidation = UserMetadataSchema.shape.userRole.safeParse(userRole);
        const userIdValidation = UserSchema.shape.updatedBy.safeParse(userId);
        if (userRoleValidation.success && userIdValidation.success) {
            this.userMetadata.userRole = userRole;
            this.userMetadata.updatedAt = new Date();
            this.updatedBy = userId;
            return {success: true, value: "updated"};
        }
        return {success: false, error: Error(userRoleValidation.error?.message || userIdValidation.error?.message)};
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
        return this.updatedBy
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

    serialize(): User {
        return {
           id: this.id,
           email: this.email,
           password: this.password,
           createdAt: this.createdAt,
           userMetadata: this.userMetadata,
           updatedBy: this.updatedBy
        };
    }
}