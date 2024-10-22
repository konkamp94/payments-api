import { BaseChargeCardDto } from "src/payments/dto/charge-card.dto";
import { PspResponse } from "./types/psp-response.type";

export interface Psp {
    paymentWorkflow(chargeCardDto: BaseChargeCardDto): Promise<PspResponse>;
}