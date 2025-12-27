// payments.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('join-auction')
  async joinAuction() {
    const paymentIntent = await this.paymentsService.createPaymentIntent(100); // 1₪ = 100 אגורות
    return { clientSecret: paymentIntent.client_secret };
  }

  @Post('setup-intent')
  async createSetupIntent() {
    const setup = await this.paymentsService.createSetupIntent();
    return { clientSecret: setup.client_secret };
  }

  @Post('save-payment-method')
  async savePaymentMethod(@Body() body: { paymentMethodId: string; customerId?: string; email?: string }) {
    let customerId = body.customerId ?? process.env.STRIPE_CUSTOMER_ID;
    if (!customerId) {
      const cust = await this.paymentsService.getOrCreateCustomer(body.email);
      customerId = cust.id;
    }

    await this.paymentsService.attachPaymentMethod(body.paymentMethodId, customerId);
    const pm = await this.paymentsService.retrievePaymentMethod(body.paymentMethodId);
    return {
      id: pm.id,
      brand: pm.card?.brand ?? 'card',
      last4: pm.card?.last4 ?? '0000',
      customerId,
    };
  }

  @Post('list')
  async listPaymentMethods(@Body() body: { customerId?: string; email?: string }) {
    let customerId = body.customerId ?? process.env.STRIPE_CUSTOMER_ID;
    if (!customerId && body.email) {
      const existing = await this.paymentsService.findCustomerByEmail(body.email);
      if (existing) customerId = existing.id;
    }

    if (!customerId) return [];
    const methods = await this.paymentsService.listPaymentMethods(customerId);
    return methods.map(pm => ({ id: pm.id, brand: pm.card?.brand ?? 'card', last4: pm.card?.last4 ?? '0000' }));
  }

  @Post('enter-auction')
  async enterAuction(@Body() body: { customerId?: string; email?: string; amount?: number }) {
    const amount = body.amount ?? 100;
    let customerId = body.customerId ?? process.env.STRIPE_CUSTOMER_ID;

    if (!customerId) {
      if (body.email) {
        const cust = await this.paymentsService.getOrCreateCustomer(body.email);
        customerId = cust.id;
      } else {
        const cust = await this.paymentsService.createCustomer();
        customerId = cust.id;
      }
    }

    const paymentIntent = await this.paymentsService.createPaymentIntentForCustomer(amount, customerId);
    const ephemeralKey = await this.paymentsService.createEphemeralKey(customerId);

    return {
      clientSecret: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customerId,
    };
  }

  @Post('charge-offsession')
  async chargeOffSession(@Body() body: { customerId: string; paymentMethodId: string; amount: number }) {
    const { customerId, paymentMethodId, amount } = body;
    if (!customerId || !paymentMethodId || !amount) return { error: 'customerId, paymentMethodId and amount are required' };

    const pi = await this.paymentsService.chargeAmountUsingPaymentMethod(amount, customerId, paymentMethodId);
    return { id: pi.id, status: pi.status, clientSecret: pi.client_secret };
  }
}
