import { BadRequestException, Body, Controller, HttpCode, HttpException, InternalServerErrorException, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { BaseChargeCardDto } from './dto/charge-card.dto';
import { ApiKeyGuard } from 'src/authentication/api-key.guard';
import { pspChargeCardDtoValidator } from './validators/psp-charge-card-dto.validator';
import { RequestWithMerchant } from './types/request.type';
import { PspResponse } from 'src/psp/psp-implementations/types/psp-response.type';
import { ChargeCardResponseDto } from './dto/charge-card-response.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('/charge-card')
  @HttpCode(200)
  @UseGuards(ApiKeyGuard)
  async chargeCard(@Req() request: RequestWithMerchant, @Body() chargeCardDto: any): Promise<ChargeCardResponseDto> {
    const enabledPsp = await this.paymentsService.findEnabledPsp(request.merchant.id);
    await pspChargeCardDtoValidator(chargeCardDto, enabledPsp.name);
    let pspResponse: PspResponse;
    try {
      pspResponse = await this.paymentsService.chargeCard(chargeCardDto, enabledPsp);
    } catch (error) {
      throw new InternalServerErrorException('Payment failed');
    }

    if (pspResponse.type === 'success') return { pspData: pspResponse.pspData, paymentStatus: pspResponse.paymentStatus };

    if (pspResponse.type === 'error') {
      if (pspResponse.statusCode >= 400 && pspResponse.statusCode < 500) {
        throw new BadRequestException({ message: pspResponse.message, statusCode: pspResponse.statusCode });
      } else if (pspResponse.statusCode >= 500) {
        console.log(500);
        throw new HttpException({ message: pspResponse.message, statusCode: pspResponse.statusCode }, 502);
      }
    };
  }
}
