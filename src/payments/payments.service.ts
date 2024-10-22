import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BaseChargeCardDto, PinPaymentsChargeCardDto, StripeChargeCardDto } from './dto/charge-card.dto';
import { PspFactory } from 'src/psp/psp-implementations/psp.factory';
import { MerchantCustomRepository } from 'src/merchant/repository/merchant-custom-repository.interface';
import { CustomRepository } from 'src/shared/repository/custom-repository.interface';
import { MerchantPsp } from 'src/merchant/entities/merchant-psp.entity';
import { EnabledPsp } from './types/enabled-psp.type';
import { ConfigService } from '@nestjs/config';
import { PspResponse } from 'src/psp/psp-implementations/types/psp-response.type';

@Injectable()
export class PaymentsService {
    constructor(
        private configService: ConfigService,
        @Inject('MERCHANT_CUSTOM_REPOSITORY') private merchantRepository: MerchantCustomRepository,
        @Inject('CUSTOM_REPOSITORY') private merchantPspRepository: CustomRepository<MerchantPsp>,
    ) { }

    async findEnabledPsp(merchantId: number): Promise<EnabledPsp> {
        const merchantPsp = await this.merchantRepository.findEnabledPspByMerchantId(merchantId);

        if (!merchantPsp) {
            throw new Error('No enabled PSP found for this merchant');
        }

        return { name: merchantPsp.psp.name, secretKey: merchantPsp.secretKey, publicKey: merchantPsp.publicKey };
    }

    async chargeCard(chargeCardDto: BaseChargeCardDto, enabledPsp: EnabledPsp): Promise<PspResponse> {
        const { name, secretKey, publicKey } = enabledPsp;
        return PspFactory.getPspInstance(name, {
            secretKey,
            publicKey
        }, this.configService).paymentWorkflow(chargeCardDto);

    };

}
