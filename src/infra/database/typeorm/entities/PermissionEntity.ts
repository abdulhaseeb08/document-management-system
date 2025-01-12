
import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn
}
from "typeorm";
import { PermissionType } from "../../../../shared/enums/PermissionType";



@Entity()
export class PermissionEntity {
    @PrimaryColumn({type: "varchar", length: 36, nullable: false})
    id: string

    @Column({type: "varchar", length: 36, nullable: false})
    creatorId: string

    @Column({type: "varchar", length: 36, nullable: false})
    userId: string

    @Column({type: "varchar", length: 36, nullable: false})
    documentId: string 

    @Column({type: "enum", enum: PermissionType, nullable: false})
    permissionType: PermissionType

    @CreateDateColumn()
    createdAt: Date
}