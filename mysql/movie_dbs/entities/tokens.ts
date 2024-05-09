import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    role: string;

    @Column()
    token: string;
}
