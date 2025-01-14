import { FileFormat } from "../../../../shared/enums/FileFormats"
import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
}
from "typeorm"
import { UserModel } from "./UserModel"
import { PermissionModel } from "./PermissionModel"

@Entity()
export class DocumentModel {
    @PrimaryColumn({type: "varchar", length: 36, nullable: false})
    id: string

    @ManyToOne(() => UserModel, (user) => user.documents)
    creator: string 

    @Column({type: "varchar", length: 100, nullable: false})
    name: string

    @Column({type: "jsonb", nullable: true})
    tags: string[]

    @CreateDateColumn()
    createdAt: Date

    @Column({type: "enum", enum: FileFormat, nullable: false})
    documentFormat: FileFormat

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => UserModel, (user) => user.documents)
    updatedBy: string

    @OneToMany(() => PermissionModel, (permission) => permission.id)
    permissions: PermissionModel[]
}