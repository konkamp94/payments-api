import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { ConfigService } from '@nestjs/config';
import { EnabledPsp } from './types/enabled-psp.type';
import { PspFactory } from '../psp/psp-implementations/psp.factory';
import { BaseChargeCardDto } from './dto/charge-card.dto';
import { PspResponse } from 'src/psp/psp-implementations/types/psp-response.type';

describe('PaymentsService', () => {
  let paymentsService: PaymentsService;
  let mockMerchantRepository: { findEnabledPspByMerchantId: jest.Mock };
  let mockPspFactory: { getPspInstance: jest.Mock };
  beforeAll(async () => {

    mockMerchantRepository = { findEnabledPspByMerchantId: jest.fn() };
    mockPspFactory = { getPspInstance: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: 'MERCHANT_CUSTOM_REPOSITORY',
          useValue: mockMerchantRepository,
        },
        {
          provide: PspFactory,
          useValue: mockPspFactory,
        }
      ],
    }).compile();

    paymentsService = module.get<PaymentsService>(PaymentsService);

  });

  it('should be defined', () => {
    expect(paymentsService).toBeDefined();
  });

  describe('findEnabledPsp', () => {
    it('should return enabled PSP', async () => {
      const merchantId = 1;
      const merchantPspWithPspDetails = {
        id: 12,
        enabled: true,
        secretKey: 'secret_key',
        publicKey: 'public_key',
        merchantId: 50,
        pspId: 46,
        psp: { id: 46, name: 'Stripe', createdAt: new Date() }
      }

      mockMerchantRepository.findEnabledPspByMerchantId.mockResolvedValue(merchantPspWithPspDetails);

      const enabledPsp: EnabledPsp = await paymentsService.findEnabledPsp(merchantId);

      expect(mockMerchantRepository.findEnabledPspByMerchantId).toHaveBeenCalledWith(merchantId);
      expect(enabledPsp).toEqual({
        name: 'Stripe', secretKey: 'secret_key', publicKey: 'public_key'
      });

    });

    it('should throw an error if no enabled PSP found', async () => {
      const merchantId = 1;

      mockMerchantRepository.findEnabledPspByMerchantId.mockResolvedValue(null);
      await expect(paymentsService.findEnabledPsp(merchantId))
        .rejects.toThrow('No enabled PSP found for this merchant');

    });
  });

  describe('chargeCard', () => {
    it('should return PSP response', async () => {
      const chargeCardDto: BaseChargeCardDto = {
        cardInfo: {
          cardNumber: "4242424242424242",
          expirationDate: "08/25",
          cvv: "312"
        },
        amount: 1000,
      }
      const enabledPsp: EnabledPsp = {
        name: 'Stripe',
        secretKey: 'secret key',
        publicKey: 'public key',
      }

      const pspResponse: PspResponse = {
        type: 'success',
        paymentStatus: 'succeeded',
        pspData: { status: 'succeeded' }
      }

      const mockPspServiceInstance = {
        paymentWorkflow: jest.fn().mockReturnValueOnce(pspResponse)
      };
      mockPspFactory.getPspInstance.mockReturnValueOnce(mockPspServiceInstance);

      const response = await paymentsService.chargeCard(chargeCardDto, enabledPsp);

      expect(mockPspFactory.getPspInstance)
        .toHaveBeenCalledWith(enabledPsp.name, { secretKey: enabledPsp.secretKey, publicKey: enabledPsp.publicKey });
      expect(mockPspServiceInstance.paymentWorkflow).toHaveBeenCalledWith(chargeCardDto);
      expect(response).toEqual({ type: 'success', paymentStatus: 'succeeded', pspData: { status: 'succeeded' } });
    });

    it('should throw an error if PSP response is not successful', async () => {

    });

  });
});
