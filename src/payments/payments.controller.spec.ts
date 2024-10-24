import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { RequestWithMerchant } from './types/request.type';
import { BadRequestException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { pspChargeCardDtoValidator } from './validators/psp-charge-card-dto.validator';
import { EnabledPsp } from './types/enabled-psp.type';

jest.mock('./validators/psp-charge-card-dto.validator');

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let mockMerchantRepository = {
    findEnabledPspByMerchantId: jest.fn(),
    findByClientId: jest.fn()
  }
  let mockPaymentsService = {
    findEnabledPsp: jest.fn(),
    chargeCard: jest.fn()
  }

  let mockRequest = { merchant: { id: 1 } } as RequestWithMerchant;
  let mockChargeCardDto = {
    "cardInfo": {
      "cardNumber": "4242424242424242",
      "expirationDate": "08/25",
      "cvv": "312"
    },
    "amount": 1000,
    "currency": "usd"
  };
  let enabledPsp: EnabledPsp = { name: 'Stripe', secretKey: 'secret', publicKey: 'public' };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{
        provide: PaymentsService,
        useValue: mockPaymentsService
      },
      {
        provide: 'MERCHANT_CUSTOM_REPOSITORY',
        useValue: mockMerchantRepository
      }
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should charge card', async () => {
    const pspResponse = { type: 'success', pspData: {}, paymentStatus: 'success' };
    mockPaymentsService.findEnabledPsp.mockResolvedValueOnce(enabledPsp);
    mockPaymentsService.chargeCard.mockResolvedValueOnce(pspResponse);
    const response = await controller.chargeCard(mockRequest, mockChargeCardDto);

    expect(response).toEqual({ pspData: pspResponse.pspData, paymentStatus: pspResponse.paymentStatus });
  });

  it('should return a response with status code 400 when psp service returns error response with status 400', async () => {
    const pspResponse = { type: 'error', message: 'error', statusCode: 400 };
    mockPaymentsService.findEnabledPsp.mockResolvedValueOnce(enabledPsp);
    mockPaymentsService.chargeCard.mockResolvedValueOnce(pspResponse);

    await expect(controller.chargeCard(mockRequest, mockChargeCardDto))
      .rejects.toThrow(new BadRequestException({ message: pspResponse.message, statusCode: pspResponse.statusCode }));

  });

  it('should return a response with status code 502 when psp service returns error response with status code 500', async () => {
    const pspResponse = { type: 'error', message: 'error', statusCode: 500 };
    mockPaymentsService.findEnabledPsp.mockResolvedValueOnce(enabledPsp);
    mockPaymentsService.chargeCard.mockResolvedValueOnce(pspResponse);

    await expect(controller.chargeCard(mockRequest, mockChargeCardDto))
      .rejects.toThrow(new HttpException({ message: pspResponse.message, statusCode: pspResponse.statusCode }, 502));

  });

  it('should throw internal server error if no enabled PSP found', async () => {
    const errorMessage = 'No enabled PSP found for this merchant. Contact support';
    mockPaymentsService.findEnabledPsp.mockRejectedValueOnce(new Error(errorMessage));

    await expect(controller.chargeCard(mockRequest, mockChargeCardDto))
      .rejects.toThrow(new InternalServerErrorException(errorMessage));
  });

  it('should throw internal server error if payments service method charge card fails', async () => {
    const errorMessage = 'Something went wrong. Payment failed';
    mockPaymentsService.findEnabledPsp.mockResolvedValueOnce(enabledPsp);
    mockPaymentsService.chargeCard.mockRejectedValueOnce(new Error());

    await expect(controller.chargeCard(mockRequest, mockChargeCardDto))
      .rejects.toThrow(new InternalServerErrorException(errorMessage));
  });

  it('should return a response with status code 400 if validator throws BadRequestException', async () => {
    const errorFormat = { message: 'error', errors: 'error_array' };
    mockPaymentsService.findEnabledPsp.mockResolvedValueOnce(enabledPsp);
    (pspChargeCardDtoValidator as jest.Mock).mockRejectedValueOnce(new BadRequestException(errorFormat));

    await expect(controller.chargeCard(mockRequest, mockChargeCardDto))
      .rejects.toThrow(new BadRequestException(errorFormat));
  });

  it('should throw internal server error if validator throws an error', async () => {
    mockPaymentsService.findEnabledPsp.mockResolvedValueOnce(enabledPsp);
    (pspChargeCardDtoValidator as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(controller.chargeCard(mockRequest, mockChargeCardDto))
      .rejects.toThrow(new InternalServerErrorException('Something went wrong. Payment failed'));
  });
});
