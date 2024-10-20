import { CustomRepository } from "src/shared/repository/custom-repository.interface";
import { Merchant } from "../entities/merchant.entity";

export interface MerchantCustomRepository extends CustomRepository<Merchant> {
    findByClientId(clientId: string): Promise<Merchant>;
}

export const MERCHANT_CUSTOM_REPOSITORY = 'MERCHANT_CUSTOM_REPOSITORY';