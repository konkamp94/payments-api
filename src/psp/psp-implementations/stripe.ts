import { Psp } from "./psp.interface";
import Stripe from 'stripe'
import { StripeChargeCardDto } from "src/payments/dto/charge-card.dto";
import { PspErrorResponse, PspPaymentResponse, PspResponse } from "./types/psp-response.type";

export class StripeService implements Psp {
    constructor(private stripe: Stripe) { }

    private async _createPaymentMethod(cardInfo: any) {
        return this.stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: cardInfo.cardNumber,
                exp_month: cardInfo.expirationDate.split('/')[0],
                exp_year: cardInfo.expirationDate.split('/')[1],
                cvc: cardInfo.cvv,
            },
        });

    }

    private async _createPaymentIntent(amount: number, currency: string) {
        return this.stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
        });
    }

    private async _addPaymentMethodAndConfirmPaymentIntent(paymentIntentId: string, paymentMethodId: string) {
        return this.stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId,
        });
    }

    async paymentWorkflow(chargeCardDto: StripeChargeCardDto): Promise<PspResponse> {
        try {
            const paymentMethod = await this._createPaymentMethod(chargeCardDto.cardInfo);
            const paymentIntent = await this._createPaymentIntent(chargeCardDto.amount, chargeCardDto.currency);
            const paymentIntentConfirmation = await this._addPaymentMethodAndConfirmPaymentIntent(paymentIntent.id, paymentMethod.id);
            const pspResponse: PspPaymentResponse = {
                type: 'success',
                paymentStatus: paymentIntentConfirmation.status,
                pspData: paymentIntentConfirmation
            };
            return pspResponse;
        } catch (error) {
            const pspErrorResponse: PspErrorResponse = {
                type: 'error',
                message: error.raw.message,
                statusCode: error.raw.statusCode
            };
            return pspErrorResponse;
        }
    }

}