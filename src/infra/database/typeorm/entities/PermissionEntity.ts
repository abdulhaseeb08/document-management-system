import { UserRole } from "../../../../shared/enums/UserRole"
import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn
}
from "typeorm"



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

    @Column({type: "enum", enum: UserRole, nullable: false})
    permissionType: string

    @CreateDateColumn()
    createdAt: Date
}