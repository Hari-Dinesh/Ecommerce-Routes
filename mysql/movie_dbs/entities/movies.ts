import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    movie_id: number;

    @Column()
    title: string;

    @Column()
    release_date: Date;

    @Column()
    runtime: number;
}
