
import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    ManyToOne
}
from "typeorm";
import { DocumentRole } from "../../../../shared/enums/DocumentRole";
import { UserModel } from "./UserModel";
import { DocumentModel } from "./DocumentModel";



@Entity()
export class PermissionModel {
    @PrimaryColumn({type: "varchar", length: 36, nullable: false})
    id: string

    @ManyToOne(() => UserModel, (user) => user.permissions)
    creator: string

    @ManyToOne(() => UserModel, (user) => user.permissions)
    user: string

    @ManyToOne(() => DocumentModel, (document) => document.permissions)
    document: string 

    @Column({type: "enum", enum: DocumentRole, nullable: false})
    permissionType: DocumentRole

    @CreateDateColumn()
    createdAt: Date
}