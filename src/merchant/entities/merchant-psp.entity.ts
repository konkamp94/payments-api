import { Merchant } from "./merchant.entity";
import { Psp } from "../../psp/entities/psp.entity";

export class MerchantPsp {
    constructor(
        public id: number,
        public merchantId: number,
        public pspId: number,
        public merchant: Merchant,
        public psp: Psp,
        public enabled: boolean,
        public publicKey: string,
        public secretKey: string,
    ) { }
}