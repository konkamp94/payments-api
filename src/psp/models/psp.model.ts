import { Merchant } from "src/merchant/models/merchant.model";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Psp {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Merchant, merchant => merchant.psps)
    merchants: Merchant[];

    @Column()
    createdAt: Date;

}