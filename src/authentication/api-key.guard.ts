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

        const [type, credentials] = authHeader.split(' ');

        if (type !== 'Basic' || !credentials) {
            throw new UnauthorizedException('Invalid Authorization header');
        }

        const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
        const [clientId, clientApiKey] = decodedCredentials.split(':');

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

        request['merchant'] = merchant;

        return true;
    }
}