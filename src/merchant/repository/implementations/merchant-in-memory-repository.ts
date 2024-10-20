import { InMemoryRepository } from "src/shared/repository/implementations/in-memory-repository";
import { Merchant } from "../../entities/merchant.entity";
import { MerchantCustomRepository } from "../merchant-custom-repository.interface";


export class MerchantInMemoryRepository extends InMemoryRepository<Merchant> implements MerchantCustomRepository {
    constructor() {
        super();
    }

    async findByClientId(clientId: string): Promise<Merchant> {
        return this.entities.find(merchant => merchant.clientId === clientId);
    }
}