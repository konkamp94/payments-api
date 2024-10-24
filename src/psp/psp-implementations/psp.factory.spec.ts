import { Test, TestingModule } from "@nestjs/testing";
import { PspFactory } from "./psp.factory";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Stripe } from "stripe";
import { StripeService } from "./stripe";
import { PinPaymentsService } from "./pin-payments";

jest.mock('axios');
jest.mock('stripe', () => {
    return {
        Stripe: jest.fn().mockImplementation((secretKey: string) => {
            return {}
        })
    }
});
jest.mock('./stripe', () => {
    return {
        StripeService: jest.fn().mockImplementation((stripe: Stripe) => {
            return {}
        })
    }
})
jest.mock('./pin-payments', () => {
    return {
        PinPaymentsService: jest.fn().mockImplementation((axiosInstance: any) => {
            return {}
        })
    }
});


describe('PspFactory', () => {
    let pspFactory: PspFactory;
    const mockConfigService = { get: jest.fn() };
    const merchantCredentials = { secretKey: 'secret_key', publicKey: 'public_key' }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PspFactory,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                }
            ],
        }).compile();

        pspFactory = module.get<PspFactory>(PspFactory);

    });

    it('should be defined', () => {
        expect(pspFactory).toBeDefined();
    });

    describe('getPspInstance', () => {
        it('should return Stripe service instance where pspName is Stripe', () => {
            const pspName = 'Stripe'
            const pspInstance = pspFactory.getPspInstance(pspName, merchantCredentials);
            expect(Stripe).toHaveBeenCalledWith(merchantCredentials.secretKey);
            expect(StripeService).toHaveBeenCalledWith(new Stripe(merchantCredentials.secretKey));
            expect(pspInstance).toBeTruthy();
        });

        it('should return PinPayments service instance where pspName is Pin Payments', () => {
            const pspName = 'Pin Payments'
            const pspInstance = pspFactory.getPspInstance(pspName, merchantCredentials);
            const axiosInstanceConfig = {
                baseURL: mockConfigService.get('PIN_PAYMENTS_BASE_URL'),
                headers: {
                    Authorization: `Basic ${Buffer.from(`${merchantCredentials.secretKey}:`).toString('base64')}`

                }
            }

            expect(axios.create).toHaveBeenCalledWith(axiosInstanceConfig);
            expect(PinPaymentsService).toHaveBeenCalledWith(axios.create(axiosInstanceConfig));
            expect(pspInstance).toBeTruthy();
        });

        it('should throw an error where pspName is not Stripe or Pin Payments', () => {
            const pspName = 'Random PSP'
            expect(() => pspFactory.getPspInstance(pspName, merchantCredentials)).toThrow('PSP implementation not found');
        });
    });

});