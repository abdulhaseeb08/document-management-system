import { FileFormat } from "../../../../shared/enums/FileFormats"
import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
}
from "typeorm"

@Entity()
export class DocumentEntity {
    @PrimaryColumn({type: "varchar", length: 36, nullable: false})
    id: string

    @Column({type: "varchar", length: 36, nullable: false})
    creatorId: string

    @Column({type: "text", nullable: false})
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