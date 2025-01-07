import { UserRole } from "../../shared/enums/UserRole";

export class Permission {
    public readonly id: string;
    public userId: string;
    public creatorId: string;
    public createdAt: Date;
    public documentId: string;
    public userRole: UserRole;

    constructor(userId: string, creatorId: string, documentId: string, userRole: UserRole) {
        this.id = crypto.randomUUID();
        this.userId = userId;
        this.creatorId = creatorId;
        this.documentId = documentId;
        this.userRole = userRole;
    }
}