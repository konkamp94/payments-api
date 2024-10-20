import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class CardInfo {

    @IsNotEmpty()
    @IsString()
    cardNumber: string;

    @IsNotEmpty()
    @IsString()
    cardHolderName: string;

    @IsNotEmpty()
    @IsString()
    expirationDate: string;

    @IsNotEmpty()
    @IsString()
    cvv: string;
}

export class ChargeCardDto {

    @ValidateNested()
    @Type(() => CardInfo)
    @IsNotEmpty()
    cardInfo: CardInfo;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

}