import Stripe from "stripe"
import { StripeService } from "./stripe"
import { MerchantPspCredentials } from "./types/merchant-credentials.type"
import { StripeChargeCardDto } from "src/payments/dto/charge-card.dto"

describe("Stripe Service", () => {
    let stripeService: StripeService
    let mockedMerchantCredentials: MerchantPspCredentials
    let stripeChargeCardDto: StripeChargeCardDto
    let stripeMock: any;

    beforeAll(async () => {
        stripeChargeCardDto = {
            cardInfo: {
                cardNumber: "4242424242424242",
                expirationDate: "08/25",
                cvv: "312"
            },
            amount: 1000,
            currency: "usd"
        }

        mockedMerchantCredentials = {
            secretKey: 'secret_key',
            publicKey: 'public_key'
        }

        stripeMock = {
            paymentMethods: {
                create: jest.fn(),
            },
            paymentIntents: {
                create: jest.fn(),
                confirm: jest.fn(),
            }
        }

        stripeService = new StripeService(stripeMock as Stripe)
    })

    it("should be defined", () => {
        expect(stripeService).toBeDefined()
    })

    it("paymentWorkflow function should return a succeeded payment", async () => {

        stripeMock.paymentMethods.create.mockResolvedValueOnce({ id: 'payment_method_id' })
        stripeMock.paymentIntents.create.mockResolvedValueOnce({ id: 'payment_intent_id' })
        stripeMock.paymentIntents.confirm.mockResolvedValueOnce({ status: 'succeeded' })
        const pspResponse = await stripeService.paymentWorkflow(stripeChargeCardDto)
        expect(pspResponse).toEqual({
            type: 'success',
            paymentStatus: 'succeeded',
            pspData: { status: 'succeeded' }
        })
    })

    it("paymentWorkflow function should return an error", async () => {
        stripeMock.paymentMethods.create.mockRejectedValueOnce({ raw: { message: 'error', statusCode: 400 } })
        const pspResponse = await stripeService.paymentWorkflow(stripeChargeCardDto)
        expect(pspResponse).toEqual({
            type: 'error',
            message: 'error',
            statusCode: 400
        })
    })

    it("paymentWorkflow function should return an error", async () => {
        stripeMock.paymentMethods.create.mockResolvedValueOnce({ id: 'payment_method_id' })
        stripeMock.paymentIntents.create.mockRejectedValueOnce({ raw: { message: 'error', statusCode: 500 } })
        const pspResponse = await stripeService.paymentWorkflow(stripeChargeCardDto)
        expect(pspResponse).toEqual({
            type: 'error',
            message: 'error',
            statusCode: 500
        })
    })
})