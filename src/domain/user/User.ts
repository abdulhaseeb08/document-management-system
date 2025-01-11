import type { UserCredentials } from "./UserCredentials";
import { UserRole } from "../../shared/enums/UserRole";

export class User {
    public readonly id: string;
    public email: string;
    public password: string;
    public createdAt: Date;
    public updatedAt: Date;
    public userRole: UserRole;

    constructor(userCredentials: UserCredentials, userRole: UserRole) {
        this.id = crypto.randomUUID();
        this.userRole = userRole
        this.email = userCredentials.email;
        this.password = userCredentials.password;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}