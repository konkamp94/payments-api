import { DataSource, Transaction } from "typeorm";
import { Merchant } from "./merchant/models/merchant.model";
import { Psp } from "./psp/models/psp.model";
import { ConfigService } from "@nestjs/config";
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { MerchantPsp } from "./merchant/models/merchant-psp.model";
import { Console } from "console";

export const seedDatabase = async (dataSource: DataSource, configService: ConfigService) => {

    const merchantRepo = dataSource.getRepository(Merchant);
    const pspRepo = dataSource.getRepository(Psp);
    const merchantPspRepo = dataSource.getRepository(MerchantPsp);

    // Check if seed data already exists
    const merchantCount = await merchantRepo.count();
    const pspCount = await pspRepo.count();
    if (merchantCount > 0 || pspCount > 0) {
        console.log("Seed data already exists");
        return;
    }

    for (let i = 0; i < 2; i++) {
        const mod = i % 2;

        const clientId = crypto.randomBytes(16).toString('hex');
        const clientApiKey = crypto.randomBytes(32).toString('hex');

        const hashedClientApiKey = await bcrypt.hash(clientApiKey, 10);

        const merchant = merchantRepo.create({
            name: "John Doe " + i,
            email: `merchant${i}@example.com`,
            phone: `123456789${i}`,
            address: "123 Merchant St " + i,
            clientId: clientId,
            clientApiKey: hashedClientApiKey,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const psp = pspRepo.create({
            name: mod === 0 ? "Stripe" : "Pin Payments",
            createdAt: new Date(),
        });

        let savedMerchant = await merchantRepo.save(merchant);
        let savedPsp = await pspRepo.save(psp);

        const merchantPsp = merchantPspRepo.create({
            merchant: savedMerchant,
            psp: savedPsp,
            secretKey: mod === 0 ? configService.get('STRIPE_SECRET_KEY') : configService.get('PIN_PAYMENTS_SECRET_KEY'),
            publicKey: mod === 0 ? configService.get('STRIPE_PUBLIC_KEY') : configService.get('PIN_PAYMENTS_PUBLIC_KEY'),
            enabled: true,
        });

        await merchantPspRepo.save(merchantPsp);

        console.log('---------------------------------');
        console.log(mod === 0 ? "Stripe Merchant" : "Pin Payments Merchant");
        console.log("clientId", clientId);
        console.log("clientApiKey", clientApiKey);
        console.log('---------------------------------');
    }

    console.log("Seed data added");
};