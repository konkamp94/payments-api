import { Psp } from "src/psp/models/psp.model";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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
    clientId: string;

    @Column()
    clientApiKey: string;

    @ManyToMany(() => Psp, psp => psp.merchants)
    psps: Psp[];

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}