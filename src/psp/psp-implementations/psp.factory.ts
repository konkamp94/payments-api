import { Psp } from './psp.interface';
import { Stripe } from 'stripe';
import { StripeService } from './stripe';
import { MerchantPspCredentials } from './types/merchant-credentials.type';
import { PinPaymentsService } from './pin-payments';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PspFactory {

    constructor(private configService: ConfigService) { }

    getPspInstance(pspName: string, merchantCredentials: MerchantPspCredentials): Psp {

        switch (pspName) {
            case 'Stripe':
                const stripe = new Stripe(merchantCredentials.secretKey);
                return new StripeService(stripe);
            case 'Pin Payments':
                const pinPaymentsAxiosInstance = axios.create({
                    baseURL: this.configService.get('PIN_PAYMENTS_BASE_URL'),
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${merchantCredentials.secretKey}:`).toString('base64')}`
                    }
                })
                return new PinPaymentsService(pinPaymentsAxiosInstance);
        }

        throw new Error('PSP implementation not found');
    }
}