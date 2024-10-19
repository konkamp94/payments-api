import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Merchant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}