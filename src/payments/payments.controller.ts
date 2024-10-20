import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ChargeCardDto } from './dto/charge-card.dto';
import { ApiKeyGuard } from 'src/authentication/auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('/charge-card')
  @UseGuards(ApiKeyGuard)
  chargeCard(@Body() chargeCardDto: ChargeCardDto): string {
    // return this.paymentsService.chargeCard();
    return 'Card charged successfully';
  }
}
