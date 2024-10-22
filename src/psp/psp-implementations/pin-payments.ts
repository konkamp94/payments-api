import { ConfigService } from "@nestjs/config";
import { Psp } from "./psp.interface";
import axios, { Axios } from "axios";
import { PinPaymentsChargeCardDto } from "src/payments/dto/charge-card.dto";
import { MerchantPspCredentials } from "./types/merchant-credentials.type";
import { Injectable } from "@nestjs/common";
import { PspResponse } from "./types/psp-response.type";

@Injectable()
export class PinPaymentsService implements Psp {
    private axiosInstance: Axios

    constructor(private configService: ConfigService, private merchantCredentials: MerchantPspCredentials) {
        console.log(this.configService.get('PIN_PAYMENTS_BASE_URL'))
        console.log(this.merchantCredentials)
        this.axiosInstance = axios.create({
            baseURL: this.configService.get('PIN_PAYMENTS_BASE_URL'),
            headers: {
                Authorization: `Basic ${Buffer.from(`${this.merchantCredentials.secretKey}:`).toString('base64')}`
            }
        })
    }

    private async _chargeCard(chargeCardDto: PinPaymentsChargeCardDto) {
        const chargeInfo = {
            email: chargeCardDto.email,
            description: chargeCardDto.description,
            amount: chargeCardDto.amount,
            // ip: "192.168.1.1",
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
            return { type: 'success', pspData: axiosResponse.data, paymentStatus: 'succeeded' }
        } catch (error) {
            console.log(error.response.data)
            return { type: 'error', message: error.response.data.messages, statusCode: error.response.status }
        }

    }

} 