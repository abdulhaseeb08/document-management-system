import { PermissionType } from "../../shared/enums/PermissionType";

export class Permission {
    public readonly id: string;
    public userId: string;
    public creatorId: string;
    public createdAt: Date;
    public documentId: string;
    public permissionType: PermissionType;

    constructor(userId: string, creatorId: string, documentId: string, permissionType: PermissionType) {
        this.id = crypto.randomUUID();
        this.userId = userId;
        this.creatorId = creatorId;
        this.documentId = documentId;
        this.permissionType = permissionType;
    }
}