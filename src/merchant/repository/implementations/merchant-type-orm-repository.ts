import { TypeOrmRepository } from "src/shared/repository/implementations/type-orm-repository";
import { Merchant } from "../../models/merchant.model";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { MerchantCustomRepository } from "../merchant-custom-repository.interface";

export class MerchantTypeOrmRepository extends TypeOrmRepository<Merchant> implements MerchantCustomRepository {
    constructor(private merchantRepository: Repository<Merchant>) {
        super(merchantRepository);
    }

    async findByClientId(clientId: string): Promise<Merchant> {
        return this.merchantRepository.findOne({ where: { clientId } });
    }
}