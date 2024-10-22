import { CustomRepository } from "src/shared/repository/custom-repository.interface";
import { Merchant } from "../entities/merchant.entity";
import { Psp } from "src/psp/entities/psp.entity";
import { MerchantPsp } from "../entities/merchant-psp.entity";

export interface MerchantCustomRepository extends CustomRepository<Merchant> {
    findByClientId(clientId: string): Promise<Merchant>;
    findEnabledPspByMerchantId(merchantId: number): Promise<MerchantPsp | null>;
}

export const MERCHANT_CUSTOM_REPOSITORY = 'MERCHANT_CUSTOM_REPOSITORY';