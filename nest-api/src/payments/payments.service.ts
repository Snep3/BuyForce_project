// payments.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
  });

  async createPaymentIntent(amount: number) {
    return this.stripe.paymentIntents.create({
      amount, // amount in the smallest currency unit (אגורות)
      currency: 'ils', 
      automatic_payment_methods: { enabled: true },
    });
  }

  async createSetupIntent() {
    return this.stripe.setupIntents.create({
      payment_method_types: ['card'],
      usage: 'off_session',
    });
  }

  async retrievePaymentMethod(paymentMethodId: string) {
    return this.stripe.paymentMethods.retrieve(paymentMethodId);
  }

  async createCustomer(email?: string) {
    return this.stripe.customers.create({ email, metadata: { createdBy: 'buyforce' } });
  }

  async findCustomerByEmail(email: string) {
    const list = await this.stripe.customers.list({ email, limit: 1 });
    return list.data && list.data.length ? list.data[0] : null;
  }

  async getOrCreateCustomer(email?: string) {
    if (!email) return this.createCustomer();
    const existing = await this.findCustomerByEmail(email);
    if (existing) return existing;
    return this.createCustomer(email);
  }

  async attachPaymentMethod(paymentMethodId: string, customerId: string) {
    return this.stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
  }

  async listPaymentMethods(customerId: string) {
    const list = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return list.data;
  }

  async createPaymentIntentForCustomer(amount: number, customerId: string) {
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'ils',
      customer: customerId,
      automatic_payment_methods: { enabled: true },
    });
  }

  async createEphemeralKey(customerId: string) {
    return this.stripe.ephemeralKeys.create({ customer: customerId }, { stripeVersion: '2025-12-15.clover' });
  }

  async chargeAmountUsingPaymentMethod(amount: number, customerId: string, paymentMethodId: string) {
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'ils',
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });
  }

  async refund(paymentIntentId: string) {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
  }
}
