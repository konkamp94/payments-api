import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Merchant } from "./merchant.model";
import { Psp } from "../../psp/models/psp.model";

@Entity()
export class MerchantPsp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    enabled: boolean;

    @Column()
    secretKey: string;

    @Column()
    publicKey: string;

    @ManyToOne(() => Merchant, (merchant) => merchant.merchantPsp)
    @JoinColumn({ name: 'merchantId' })
    merchant: Merchant;

    @ManyToOne(() => Psp, (psp) => psp.merchantPsp)
    @JoinColumn({ name: 'pspId' })
    psp: Psp;

    @Column()
    merchantId: number;

    @Column()
    pspId: number;


}