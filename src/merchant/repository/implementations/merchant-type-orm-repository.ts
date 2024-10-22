import { TypeOrmRepository } from "src/shared/repository/implementations/type-orm-repository";
import { Merchant } from "../../models/merchant.model";
import { Repository } from "typeorm";
import { MerchantCustomRepository } from "../merchant-custom-repository.interface";
import { Psp } from "src/psp/models/psp.model";
import { MerchantPsp } from "src/merchant/models/merchant-psp.model";

export class MerchantTypeOrmRepository extends TypeOrmRepository<Merchant> implements MerchantCustomRepository {
    constructor(private merchantRepository: Repository<Merchant>) {
        super(merchantRepository);
    }

    async findByClientId(clientId: string): Promise<Merchant> {
        return this.merchantRepository.findOne({ where: { clientId }, relations: ['merchantPsp'] });
    }

    async findEnabledPspByMerchantId(merchantId: number): Promise<MerchantPsp | null> {
        const merchantWithPsp = await this.merchantRepository.createQueryBuilder('merchant')
            .leftJoinAndSelect('merchant.merchantPsp', 'merchantPsp')
            .leftJoinAndSelect('merchantPsp.psp', 'psp')
            .where('merchant.id = :merchantId', { merchantId })
            .andWhere('merchantPsp.enabled = true')
            .getOne()

        if (!merchantWithPsp || merchantWithPsp.merchantPsp.length === 0) {
            return null;
        }

        return merchantWithPsp.merchantPsp[0];
    }
}