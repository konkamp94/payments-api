import { BadRequestException } from "@nestjs/common";
import { StripeCardInfo, PinPaymentsChargeCardDto, StripeChargeCardDto, PinPaymentsCardInfo, BaseChargeCardDto } from "../dto/charge-card.dto";
import { validate } from "class-validator";

const PspNameToDto = {
    'Stripe': { dto: StripeChargeCardDto, cardInfo: StripeCardInfo },
    'Pin Payments': { dto: PinPaymentsChargeCardDto, cardInfo: PinPaymentsCardInfo }
}

export const pspChargeCardDtoValidator = async (chargeCardDto: BaseChargeCardDto, pspName: string) => {
    const dtoInstance = new PspNameToDto[pspName].dto();
    const cardInfoInstance = new PspNameToDto[pspName].cardInfo();

    Object.assign(dtoInstance, chargeCardDto);
    // workaround to validate nested object properties
    Object.assign(cardInfoInstance, chargeCardDto.cardInfo);
    dtoInstance.cardInfo = cardInfoInstance;
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
        const formattedErrors = errors.map(error => {
            return { [error.property]: error.children?.map(child => child.constraints) };
        });
        throw new BadRequestException({
            message: `${pspName} PSP is enabled for your merchant. Please review the following errors`,
            errors: JSON.stringify(formattedErrors).replace(/"/g, '')
        });
    }
}