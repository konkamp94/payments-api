import { Psp } from "src/psp/models/psp.model";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MerchantPsp } from "./merchant-psp.model";

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

    @OneToMany(() => MerchantPsp, merchantPsp => merchantPsp.merchant)
    merchantPsp: MerchantPsp[];

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}