import { DataSource } from "typeorm";
import { Merchant } from "./merchant/models/merchant.model";
import { Psp } from "./psp/models/psp.model";
import { ConfigService } from "@nestjs/config";
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export const seedDatabase = async (dataSource: DataSource, configService: ConfigService) => {

    const merchantRepo = dataSource.getRepository(Merchant);
    const pspRepo = dataSource.getRepository(Psp);

    // Check if seed data already exists
    // const merchantCount = await merchantRepo.count();
    // const pspCount = await pspRepo.count();
    // if (merchantCount > 0 || pspCount > 0) {
    //     console.log("Seed data already exists");
    //     return;
    // }

    const clientId = crypto.randomBytes(16).toString('hex');
    const clientApiKey = crypto.randomBytes(32).toString('hex');

    console.log("clientId", clientId);
    console.log("clientApiKey", clientApiKey);
    const hashedClientApiKey = await bcrypt.hash(clientApiKey, 10);

    const merchant = merchantRepo.create({
        name: "Joe Doe",
        email: "merchant@example.com",
        phone: "1234567890",
        address: "123 Merchant St",
        clientId: clientId,
        clientApiKey: hashedClientApiKey,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const psp = pspRepo.create({
        name: "Stripe",
        createdAt: new Date(),
    });

    // Save the entities to the database
    await merchantRepo.save(merchant);
    await pspRepo.save(psp);

    console.log("Seed data added");
};