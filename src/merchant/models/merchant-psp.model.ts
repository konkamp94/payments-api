import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Merchant } from "./merchant.model";
import { Psp } from "../../psp/models/psp.model";

@Entity()
export class MerchantPsp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    enabled: boolean;

    @ManyToOne(() => Merchant, (merchant) => merchant.psps)
    @JoinColumn({ name: 'merchantId' })
    user: Merchant;

    @ManyToOne(() => Psp, (psp) => psp.merchants)
    @JoinColumn({ name: 'pspId' })
    psp: Psp;


}