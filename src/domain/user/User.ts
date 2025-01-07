import type { UserCredentials } from "./UserCredentials";

export class User {
    public readonly id: string;
    public email: string;
    public password: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(userCredentials: UserCredentials) {
        this.id = crypto.randomUUID();
        this.email = userCredentials.email;
        this.password = userCredentials.password;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}