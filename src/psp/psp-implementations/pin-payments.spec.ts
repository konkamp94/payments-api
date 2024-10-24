import { PinPaymentsChargeCardDto } from "src/payments/dto/charge-card.dto";
import { PinPaymentsService } from "./pin-payments";
import { MerchantPspCredentials } from "./types/merchant-credentials.type";

describe("Pin Payments Service", () => {
    let pinPaymentsService: PinPaymentsService
    let mockedMerchantCredentials: MerchantPspCredentials
    let pinPaymentsChargeCardDto: PinPaymentsChargeCardDto
    let axiosMock: any;

    beforeAll(async () => {
        pinPaymentsChargeCardDto = {
            cardInfo: {
                cardNumber: "4242424242424242",
                expirationDate: "08/25",
                cvv: "312",
                cardHolderName: "John Doe",
                address: "123 Street",
                addressCity: "Melbourne",
                addressPostcode: "3000",
                addressState: "VIC",
                addressCountry: "Australia"
            },
            amount: 1000,
            currency: "usd",
            email: "example@gmail.com",
            description: "test charge"
        }

        mockedMerchantCredentials = {
            secretKey: 'secret  key',
            publicKey: 'public key'
        }

        axiosMock = {
            post: jest.fn()
        }

        pinPaymentsService = new PinPaymentsService(axiosMock)
    });

    it("should be defined", () => {
        expect(pinPaymentsService).toBeDefined()
    })

    it("paymentWorkflow function should return a successful payment response", async () => {
        const mockAxiosResponse = { data: { response: { success: true } } }
        axiosMock.post.mockResolvedValueOnce(mockAxiosResponse)
        const pspResponse = await pinPaymentsService.paymentWorkflow(pinPaymentsChargeCardDto)
        expect(pspResponse).toEqual({
            type: 'success',
            paymentStatus: 'succeeded',
            pspData: { success: true }
        })
    })

    it("paymentWorkflow function should return an error response", async () => {
        const mockAxiosError = { response: { data: { error_description: 'error' }, status: 400 } }
        axiosMock.post.mockRejectedValueOnce(mockAxiosError)
        const pspResponse = await pinPaymentsService.paymentWorkflow(pinPaymentsChargeCardDto)
        expect(pspResponse).toEqual({
            type: 'error',
            message: mockAxiosError.response.data.error_description,
            statusCode: mockAxiosError.response.status
        })
    })
});