import { Merchant } from "src/merchant/entities/merchant.entity"
import { Request } from "express"

export interface RequestWithMerchant extends Request {
    merchant: Merchant;
}