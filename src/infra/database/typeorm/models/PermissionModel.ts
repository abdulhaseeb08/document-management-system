
import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    ManyToOne
}
from "typeorm";
import { PermissionType } from "../../../../shared/enums/PermissionType";
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

    @Column({type: "enum", enum: PermissionType, nullable: false})
    permissionType: PermissionType

    @CreateDateColumn()
    createdAt: Date
}