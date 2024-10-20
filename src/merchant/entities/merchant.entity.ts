export class Merchant {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public phone: string,
        public address: string,
        public clientId: string,
        public clientApiKey: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}
