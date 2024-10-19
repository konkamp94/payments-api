import { Injectable, Provider } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TypeOrmRepository } from "./implementations/type-orm-repository";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { InMemoryRepository } from "./implementations/in-memory-repository";
import { Merchant } from "src/merchant/models/merchant.model";
import { Psp } from "src/psp/models/psp.model";
import { EntityEnum } from "./types/entity.enum";
import { Merchant as MerchantEntity } from "src/merchant/entities/merchant.entity";
import { Psp as PspEntity } from "src/psp/entities/psp.entity";

const mapEntityToTypeOrmModel = (entity: EntityEnum): new () => Merchant | Psp => {
    switch (entity) {
        case EntityEnum.MERCHANT:
            return Merchant;
        case EntityEnum.PSP:
            return Psp;
    }
}

@Injectable()
class CustomRepositoryDependenciesProvider<T> {
    constructor(
        public typeOrmRepository: Repository<T>,
    ) { }
}

function createCustomRepositoryDependenciesProvider<T>(
    entity: new () => T,
): new (repository: Repository<T>) => CustomRepositoryDependenciesProvider<T> {
    @Injectable()
    class DynamicCustomRepositoryDependenciesProvider extends CustomRepositoryDependenciesProvider<T> {
        constructor(@InjectRepository(entity) typeOrmRepository: Repository<T>) {
            super(typeOrmRepository);
        }
    }

    return DynamicCustomRepositoryDependenciesProvider;
}

const provideCustomRepositoryFactory = async (configService: ConfigService, dependenciesProvider) => {
    await ConfigModule.envVariablesLoaded;
    switch (configService.get('DATASOURCE_TYPE')) {
        case 'SQL':
            return new TypeOrmRepository(dependenciesProvider.typeOrmRepository);
        case 'IN_MEMORY':
            return new InMemoryRepository<MerchantEntity | PspEntity>();
    }
}

export function provideCustomRepository(entity: EntityEnum): Provider[] {
    const dependenciesProvider = createCustomRepositoryDependenciesProvider(mapEntityToTypeOrmModel(entity));
    return [
        {
            provide: 'CUSTOM_REPOSITORY',
            useFactory: async (configService: ConfigService, dependenciesProvider) => {
                return provideCustomRepositoryFactory(configService, dependenciesProvider);
            },
            inject: [ConfigService, dependenciesProvider],
        },
        dependenciesProvider,
    ];
}