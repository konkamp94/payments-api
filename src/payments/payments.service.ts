import { Inject, Injectable } from '@nestjs/common';
import { BaseChargeCardDto } from './dto/charge-card.dto';
import { PspFactory } from '../psp/psp-implementations/psp.factory';
import { MerchantCustomRepository } from 'src/merchant/repository/merchant-custom-repository.interface';
import { EnabledPsp } from './types/enabled-psp.type';
import { PspResponse } from 'src/psp/psp-implementations/types/psp-response.type';

@Injectable()
export class PaymentsService {
    constructor(
        private pspFactory: PspFactory,
        @Inject('MERCHANT_CUSTOM_REPOSITORY') private merchantRepository: MerchantCustomRepository,
    ) { }

    async findEnabledPsp(merchantId: number): Promise<EnabledPsp> {
        const merchantPsp = await this.merchantRepository.findEnabledPspByMerchantId(merchantId);
        if (!merchantPsp) {
            throw new Error('No enabled PSP found for this merchant. Contact support');
        }

        return { name: merchantPsp.psp.name, secretKey: merchantPsp.secretKey, publicKey: merchantPsp.publicKey };
    }

    async chargeCard(chargeCardDto: BaseChargeCardDto, enabledPsp: EnabledPsp): Promise<PspResponse> {
        const { name, secretKey, publicKey } = enabledPsp;
        return this.pspFactory.getPspInstance(name, { secretKey, publicKey })
            .paymentWorkflow(chargeCardDto);

    };

}
