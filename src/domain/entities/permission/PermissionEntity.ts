import type { UUID } from "../../../shared/types";
import { PermissionSchema } from "../../../app/schema/PermissionSchema";
import type { CommandResult } from "../../../shared/types";
import type { Permission } from "./Permisson";
import { DocumentRole } from "../../../shared/enums/DocumentRole";
import { matchRes, Result } from "joji-ct-fp";
import { validatePermission } from "../../schema/PermissionSchema";

export class PermissionEntity implements Permission {
    readonly id: UUID; // uuid of permission
    readonly userId: UUID; //uuid of the user to whom permission is granted
    readonly creatorId: UUID; //uuid of the user who granted the permission
    readonly documentId: UUID; //uuid of the granted document
    readonly createdAt: Date;
    readonly permissionType: DocumentRole //the type of permission

    private constructor(userId: UUID, creatorId: UUID, documentId: UUID, permissionType: DocumentRole) {
        this.id = crypto.randomUUID() as UUID;
        this.userId = userId;
        this.creatorId = creatorId;
        this.documentId = documentId;
        this.permissionType = permissionType;
        this.createdAt = new Date();
    }

    public static create(userId: UUID, creatorId: UUID, documentId: UUID, permissionType: DocumentRole): Result<PermissionEntity, Error> {
        const permissionEntity = new PermissionEntity(userId, creatorId, documentId, permissionType);
        const validation = validatePermission(permissionEntity.serialize());
        return matchRes(validation, {
            Ok: () => Result.Ok(permissionEntity),
            Err: (err) => Result.Err(err)
        })
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

    public getPermissionType(): DocumentRole {
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