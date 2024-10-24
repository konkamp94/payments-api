import { BadRequestException, Body, Controller, HttpCode, HttpException, InternalServerErrorException, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { BaseChargeCardDto } from './dto/charge-card.dto';
import { ApiKeyGuard } from '../authentication/api-key.guard';
import { pspChargeCardDtoValidator } from './validators/psp-charge-card-dto.validator';
import { RequestWithMerchant } from './types/request.type';
import { PspResponse } from '../psp/psp-implementations/types/psp-response.type';
import { ChargeCardResponseDto } from './dto/charge-card-response.dto';
import { EnabledPsp } from './types/enabled-psp.type';
import { isIn, isInstance } from 'class-validator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('/charge-card')
  @HttpCode(200)
  @UseGuards(ApiKeyGuard)
  async chargeCard(@Req() request: RequestWithMerchant, @Body() chargeCardDto: any): Promise<ChargeCardResponseDto> {
    let pspResponse: PspResponse;
    let enabledPsp: EnabledPsp;

    try {
      // find enabled PSP for merchant
      enabledPsp = await this.paymentsService.findEnabledPsp(request.merchant.id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    // validate dto based on enabled PSP
    try {
      await pspChargeCardDtoValidator(chargeCardDto, enabledPsp.name);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      } else {
        throw new InternalServerErrorException('Something went wrong. Payment failed');
      }
    }

    try {
      // charge card using enabled PSP
      pspResponse = await this.paymentsService.chargeCard(chargeCardDto, enabledPsp);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong. Payment failed');
    }

    if (pspResponse.type === 'success') return { pspData: pspResponse.pspData, paymentStatus: pspResponse.paymentStatus };

    if (pspResponse.type === 'error') {
      if (pspResponse.statusCode >= 400 && pspResponse.statusCode < 500) {
        throw new BadRequestException({ message: pspResponse.message, statusCode: pspResponse.statusCode });
      } else if (pspResponse.statusCode >= 500) {
        throw new HttpException({ message: pspResponse.message, statusCode: pspResponse.statusCode }, 502);
      }
    };
  }
}
