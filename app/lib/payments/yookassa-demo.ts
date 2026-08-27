export type PaymentMethod = 'bank_card' | 'sbp';

export type CreatePaymentInput = {
  campaignId: string;
  campaignTitle: string;
  amount: number;
  donorName: string;
  anonymous: boolean;
  method: PaymentMethod;
};

export type DemoPayment = {
  id: string;
  provider: 'yookassa_demo';
  status: 'succeeded';
  confirmationUrl: string;
  amount: number;
  method: PaymentMethod;
  createdAt: string;
};

export async function createDemoYookassaPayment(
  input: CreatePaymentInput,
): Promise<DemoPayment> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  return {
    id: `demo_yk_${Date.now()}`,
    provider: 'yookassa_demo',
    status: 'succeeded',
    confirmationUrl: '#demo-yookassa-success',
    amount: input.amount,
    method: input.method,
    createdAt: new Date().toISOString(),
  };
}
