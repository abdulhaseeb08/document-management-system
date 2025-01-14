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

@Entity()
export class DocumentModel {
    @PrimaryColumn({type: "varchar", length: 36, nullable: false})
    id: string

    @ManyToOne(() => UserModel, (user) => user.documents)
    creator: UserModel 

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

    @Column({type: "varchar", length: 36, nullable: false})
    updatedBy: string
}