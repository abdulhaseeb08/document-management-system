import { UserRole } from "../../shared/UserRole";
import type { UserCredentials } from "./UserCredentials";

export class User {
    public readonly id: string;
    public email: string;
    public password: string;
    public role: UserRole;
    public createdAt: Date;

    constructor(userCredentials: UserCredentials) {
        this.id = crypto.randomUUID();
        this.email = userCredentials.email;
        this.password = userCredentials.password;
        this.role = userCredentials.role;
        this.createdAt = new Date()
    }
}