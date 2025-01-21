import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
}
from "typeorm";
import { UserRole } from "../../../../shared/enums/UserRole"
import { DocumentModel } from "./DocumentModel";
import { PermissionModel } from "./PermissionModel";

@Entity()
export class UserModel {
    @PrimaryColumn({type: "varchar", length: 36, nullable: false})
    id: string

    @Column({type: "varchar", length: 36, nullable: false})
    updatedBy: string

    @Column({type: "varchar", length: 50, nullable: false})
    name: string

    @Column({type: "varchar", length: 320, nullable: false})
    email: string

    @Column({type: "text", nullable: false})
    password: string 

    @Column({type: "enum", enum: UserRole, nullable: false})
    userRole: UserRole

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => DocumentModel, (document) => document.id, {cascade: true})
    documents: DocumentModel[]

    @OneToMany(() => PermissionModel, (permission) => permission.id, {cascade: true})
    permissions: PermissionModel[]
}