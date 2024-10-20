import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MerchantCustomRepository } from 'src/merchant/repository/merchant-custom-repository.interface';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(@Inject('MERCHANT_CUSTOM_REPOSITORY') private merchantRepository: MerchantCustomRepository) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Missing Authorization header');
        }

        const [clientId, clientApiKey] = authHeader.split(':');

        if (!clientId || !clientApiKey) {
            throw new UnauthorizedException('Invalid Authorization header');
        }

        const merchant = await this.merchantRepository.findByClientId(clientId);

        if (!merchant) {
            throw new UnauthorizedException('Merchant not found');
        }

        const isApiKeyValid = await bcrypt.compare(clientApiKey, merchant.clientApiKey);

        if (!isApiKeyValid) {
            throw new UnauthorizedException('Invalid API key');
        }

        return true;
    }
}