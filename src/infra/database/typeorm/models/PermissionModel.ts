
import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    OneToMany
}
from "typeorm";
import { PermissionType } from "../../../../shared/enums/PermissionType";
import { UserModel } from "./UserModel";
import { DocumentModel } from "./DocumentModel";



@Entity()
export class PermissionModel {
    @PrimaryColumn({type: "varchar", length: 36, nullable: false})
    id: string

    @OneToMany(() => UserModel, (user) => user.id)
    creatorId: string

    @OneToMany(() => UserModel, (user) => user.id)
    @Column({type: "varchar", length: 36, nullable: false})
    userId: string

    @OneToMany(() => DocumentModel, (document) => document.id)
    documentId: string 

    @Column({type: "enum", enum: PermissionType, nullable: false})
    permissionType: PermissionType

    @CreateDateColumn()
    createdAt: Date
}