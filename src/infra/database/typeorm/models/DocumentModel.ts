import { FileFormat } from "../../../../shared/enums/FileFormats"
import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
}
from "typeorm"
import { UserModel } from "./UserModel"
import { PermissionModel } from "./PermissionModel"
import type { Relation } from 'typeorm';

@Entity()
export class DocumentModel {
    @PrimaryColumn({type: "varchar", length: 36, nullable: false})
    id: string

    @ManyToOne(() => UserModel, (user) => user.documents)
    creator: Relation<UserModel>; 

    @Column({type: "varchar", length: 100, nullable: false})
    name: string

    @Column({type: "varchar", length: 255, nullable: false})
    filePath: string

    @Column({type: "jsonb", nullable: true})
    tags: string[]

    @CreateDateColumn()
    createdAt: Date

    @Column({type: "enum", enum: FileFormat, nullable: false})
    documentFormat: FileFormat

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => UserModel, (user) => user.documents)
    updatedBy: Relation<UserModel>

    @OneToMany(() => PermissionModel, (permission) => permission.id)
    permissions: PermissionModel[]
}