
import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    type Relation
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
    creator: Relation<UserModel>

    @ManyToOne(() => UserModel, (user) => user.permissions)
    user: Relation<UserModel>

    @ManyToOne(() => DocumentModel, (document) => document.permissions)
    document: Relation<DocumentModel>

    @Column({type: "enum", enum: DocumentRole, nullable: false})
    permissionType: DocumentRole

    @CreateDateColumn()
    createdAt: Date
}