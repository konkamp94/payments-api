import { Type } from "class-transformer";
import { IsEmail, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateNested } from "class-validator";

export class BaseCardInfo {

    @IsNotEmpty()
    @IsString()
    cardNumber: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    expirationDate: string;

    @IsNotEmpty()
    @IsString()
    cvv: string;
}

export class StripeCardInfo extends BaseCardInfo { }

export class PinPaymentsCardInfo extends BaseCardInfo {

    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z]+\s[A-Za-z]+$/)
    cardHolderName: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    addressCity: string;

    @IsNotEmpty()
    @IsString()
    addressPostcode: string;

    @IsNotEmpty()
    @IsString()
    addressState: string;

    @IsNotEmpty()
    @IsString()
    addressCountry: string;

}

export class BaseChargeCardDto {

    @ValidateNested()
    @Type(() => BaseCardInfo)
    @IsNotEmpty()
    cardInfo: BaseCardInfo;

    @IsNotEmpty()
    @IsNumber()
    amount: number;
}

export class StripeChargeCardDto extends BaseChargeCardDto {

    @ValidateNested()
    @Type(() => StripeCardInfo)
    @IsNotEmpty()
    cardInfo: StripeCardInfo;

    @IsNotEmpty()
    @IsString()
    currency: string;
}

export class PinPaymentsChargeCardDto extends BaseChargeCardDto {

    @ValidateNested()
    @Type(() => PinPaymentsCardInfo)
    @IsNotEmpty()
    cardInfo: PinPaymentsCardInfo;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    currency: string;
}
