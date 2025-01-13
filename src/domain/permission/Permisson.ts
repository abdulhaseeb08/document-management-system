import { PermissionType } from "../../shared/enums/PermissionType";

export class Permission {
    public id: string;
    public userId: string;
    public creatorId: string;
    public createdAt: Date;
    public documentId: string;
    public permissionType: PermissionType;

    constructor(userId: string, creatorId: string, documentId: string, permissionType: PermissionType, createdAt: Date, id?: string) {
        this.id = id ?? crypto.randomUUID();
        this.userId = userId;
        this.createdAt = createdAt ?? new Date();
        this.creatorId = creatorId;
        this.documentId = documentId;
        this.permissionType = permissionType;
    }
}