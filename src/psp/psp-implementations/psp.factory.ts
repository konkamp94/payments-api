import { Psp } from './psp.interface';
import { StripeService } from './stripe';
import { MerchantPspCredentials } from './types/merchant-credentials.type';
import { PinPaymentsService } from './pin-payments';
import { ConfigService } from '@nestjs/config';

export class PspFactory {
    static mapPspNameToPspClass = {
        'Stripe': StripeService,
        'Pin Payments': PinPaymentsService
    }
    static getPspInstance(pspName: string, merchantCredentials: MerchantPspCredentials, configService: ConfigService): Psp {

        switch (pspName) {
            case 'Stripe':
                return new StripeService(merchantCredentials);
            case 'Pin Payments':
                return new PinPaymentsService(configService, merchantCredentials);
        }

        throw new Error('PSP implementation not found');
    }
}