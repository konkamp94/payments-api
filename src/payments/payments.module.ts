import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { EntityEnum } from 'src/shared/repository/types/entity.enum';
import { provideCustomRepository } from 'src/shared/repository/custom-repository-provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from 'src/merchant/models/merchant.model';
import { MerchantPsp } from 'src/merchant/models/merchant-psp.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant, MerchantPsp])],
  controllers: [PaymentsController],
  providers: [PaymentsService,
    ...provideCustomRepository(EntityEnum.MERCHANT, 'MERCHANT_CUSTOM_REPOSITORY'),
    ...provideCustomRepository(EntityEnum.MERCHANT_PSP, 'CUSTOM_REPOSITORY')
  ],
})
export class PaymentsModule { }
