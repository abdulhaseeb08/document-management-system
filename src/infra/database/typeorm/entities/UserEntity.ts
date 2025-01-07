import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
}
from "typeorm"

@Entity()
export class UserEntity {
    @PrimaryColumn({type: "varchar", length: 36, nullable: false})
    id: string

    @Column({type: "varchar", length: 320, nullable: false})
    email: string

    @Column({type: "text", nullable: false})
    password: string 

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string
}