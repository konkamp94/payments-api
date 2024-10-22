export interface PspPaymentResponse {
    type: 'success';
    paymentStatus: any;
    pspData: any;
};

export interface PspErrorResponse {
    type: 'error';
    statusCode: number;
    message: string;
}

export type PspResponse = PspPaymentResponse | PspErrorResponse;