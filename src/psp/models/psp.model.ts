import { MerchantPsp } from "src/merchant/models/merchant-psp.model";
import { Merchant } from "src/merchant/models/merchant.model";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Psp {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => MerchantPsp, merchantPsp => merchantPsp.psp)
    merchantPsp: MerchantPsp[];

    @Column()
    createdAt: Date;

}