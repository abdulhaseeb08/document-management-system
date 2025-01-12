import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
}
from "typeorm";
import { UserRole } from "../../../../shared/enums/UserRole"

@Entity()
export class UserEntity {
    @PrimaryColumn({type: "varchar", length: 36, nullable: false})
    id: string

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
}