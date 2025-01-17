import type { UUID } from "../../../shared/types";
import { PermissionSchema } from "../../../app/schema/PermissionSchema";
import type { CommandResult } from "../../../shared/types";
import type { Permission } from "./Permisson";
import { PermissionType } from "../../../shared/enums/PermissionType";

export class PermissionEntity implements Permission {
    readonly id: UUID; // uuid of permission
    readonly userId: UUID; //uuid of the user to whom permission is granted
    readonly creatorId: UUID; //uuid of the user who granted the permission
    readonly documentId: UUID; //uuid of the granted document
    readonly createdAt: Date;
    readonly permissionType: PermissionType //the type of permission

    private constructor(userId: UUID, creatorId: UUID, documentId: UUID, permissionType: PermissionType) {
        this.id = crypto.randomUUID() as UUID;
        this.userId = userId;
        this.creatorId = creatorId;
        this.documentId = documentId;
        this.permissionType = permissionType;
        this.createdAt = new Date();
    }

    public static create(userId: UUID, creatorId: UUID, documentId: UUID, permissionType: PermissionType): CommandResult<PermissionEntity> {
        const permissionEntity = new PermissionEntity(userId, creatorId, documentId, permissionType);
        const validation = PermissionSchema.safeParse(permissionEntity.serialize());
        if (validation.success) {
            return {success: true, value: permissionEntity};
        }
        return {success: false, error: Error(validation.error.message)};
    }

    public getId(): UUID {
        return this.id;
    }

    public getUserId(): UUID {
        return this.userId;
    }

    public getCreatorId(): UUID {
        return this.creatorId;
    }

    public getDocumentId(): UUID {
        return this.documentId;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getPermissionType(): PermissionType {
        return this.permissionType;
    }

    serialize(): Permission {
        return {
           id: this.id,
           userId: this.userId,
           creatorId: this.creatorId,
           documentId: this.documentId,
           createdAt: this.createdAt,
           permissionType: this.permissionType
        };
    }
}