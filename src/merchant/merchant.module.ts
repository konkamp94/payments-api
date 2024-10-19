import { Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { MerchantController } from './merchant.controller';
import { provideCustomRepository } from 'src/shared/repository/custom-repository-provider';
import { Merchant } from './models/merchant.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityEnum } from 'src/shared/repository/types/entity.enum';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant])],
  controllers: [MerchantController],
  providers: [MerchantService, ...provideCustomRepository(EntityEnum.MERCHANT)],
})
export class MerchantModule { }
