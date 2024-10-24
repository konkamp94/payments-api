import { ConfigService } from "@nestjs/config";
import { Psp } from "./psp.interface";
import axios, { Axios } from "axios";
import { PinPaymentsChargeCardDto } from "src/payments/dto/charge-card.dto";
import { MerchantPspCredentials } from "./types/merchant-credentials.type";
import { Injectable } from "@nestjs/common";
import { PspResponse } from "./types/psp-response.type";

@Injectable()
export class PinPaymentsService implements Psp {

    constructor(private axiosInstance: Axios) { }

    private async _chargeCard(chargeCardDto: PinPaymentsChargeCardDto) {
        const chargeInfo = {
            email: chargeCardDto.email,
            description: chargeCardDto.description,
            amount: chargeCardDto.amount,
            card: {
                number: chargeCardDto.cardInfo.cardNumber,
                expiry_month: chargeCardDto.cardInfo.expirationDate.split('/')[0],
                expiry_year: chargeCardDto.cardInfo.expirationDate.split('/')[1],
                cvc: chargeCardDto.cardInfo.cvv,
                name: chargeCardDto.cardInfo.cardHolderName,
                address_line1: chargeCardDto.cardInfo.address,
                address_city: chargeCardDto.cardInfo.addressCity,
                address_postcode: chargeCardDto.cardInfo.addressPostcode,
                address_state: chargeCardDto.cardInfo.addressState,
                address_country: chargeCardDto.cardInfo.addressCountry,
            }
        }

        if (chargeCardDto.currency) {
            chargeInfo['currency'] = chargeCardDto.currency
        }

        return this.axiosInstance.post('/charges', chargeInfo);
    }

    async paymentWorkflow(chargeCardDto: PinPaymentsChargeCardDto): Promise<PspResponse> {
        try {
            const axiosResponse = await this._chargeCard(chargeCardDto);
            return {
                type: 'success',
                pspData: axiosResponse.data.response,
                paymentStatus: axiosResponse.data.response.success ? 'succeeded' : 'failed'
            }
        } catch (error) {
            return { type: 'error', message: error.response.data.error_description, statusCode: error.response.status }
        }

    }

} 