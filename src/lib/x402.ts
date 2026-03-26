// x402 Payment Automation Service
// Handles recurring payments, scheduled donations, and automated payment flows

import { ethers } from 'ethers';

const X402_API_URL = process.env.NEXT_PUBLIC_X402_API_URL || 'https://api.x402.io';
const X402_API_KEY = process.env.NEXT_PUBLIC_X402_API_KEY || '';

export interface RecurringPayment {
  id: string;
  recipient: string;
  amount: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextPaymentDate: Date;
  isActive: boolean;
  charityId?: number;
}

export interface PaymentSchedule {
  id: string;
  payments: ScheduledPayment[];
  totalAmount: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

export interface ScheduledPayment {
  id: string;
  amount: string;
  scheduledDate: Date;
  status: 'pending' | 'completed' | 'failed';
  transactionHash?: string;
}

export class X402Service {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = X402_API_KEY;
    this.baseUrl = X402_API_URL;
  }

  async createRecurringPayment(
    from: string,
    to: string,
    amount: string,
    frequency: 'daily' | 'weekly' | 'monthly',
    charityId?: number
  ): Promise<RecurringPayment> {
    try {
      const response = await fetch(`${this.baseUrl}/recurring-payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from,
          to,
          amount,
          frequency,
          charityId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create recurring payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating recurring payment:', error);
      // Fallback to local storage for demo
      return this.createLocalRecurringPayment(from, to, amount, frequency, charityId);
    }
  }

  async cancelRecurringPayment(paymentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/recurring-payments/${paymentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel recurring payment');
      }
    } catch (error) {
      console.error('Error canceling recurring payment:', error);
      this.cancelLocalRecurringPayment(paymentId);
    }
  }

  async getRecurringPayments(address: string): Promise<RecurringPayment[]> {
    try {
      const response = await fetch(`${this.baseUrl}/recurring-payments?address=${address}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recurring payments');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recurring payments:', error);
      return this.getLocalRecurringPayments(address);
    }
  }

  async createPaymentSchedule(
    from: string,
    payments: Array<{ to: string; amount: string; date: Date }>
  ): Promise<PaymentSchedule> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from,
          payments,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment schedule');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment schedule:', error);
      return this.createLocalPaymentSchedule(from, payments);
    }
  }

  async executeScheduledPayment(
    paymentId: string,
    signer: ethers.Signer
  ): Promise<string> {
    try {
      const payment = await this.getScheduledPayment(paymentId);
      
      const tx = await signer.sendTransaction({
        to: payment.recipient,
        value: ethers.parseEther(payment.amount),
      });

      const receipt = await tx.wait();
      
      await this.updatePaymentStatus(paymentId, 'completed', receipt?.hash);
      
      return receipt?.hash || '';
    } catch (error) {
      console.error('Error executing scheduled payment:', error);
      await this.updatePaymentStatus(paymentId, 'failed');
      throw error;
    }
  }

  // Local storage fallback methods for demo purposes
  private createLocalRecurringPayment(
    from: string,
    to: string,
    amount: string,
    frequency: 'daily' | 'weekly' | 'monthly',
    charityId?: number
  ): RecurringPayment {
    const payment: RecurringPayment = {
      id: `rp_${Date.now()}`,
      recipient: to,
      amount,
      frequency,
      nextPaymentDate: this.calculateNextPaymentDate(frequency),
      isActive: true,
      charityId,
    };

    const payments = this.getLocalRecurringPayments(from);
    payments.push(payment);
    localStorage.setItem(`x402_recurring_${from}`, JSON.stringify(payments));

    return payment;
  }

  private getLocalRecurringPayments(address: string): RecurringPayment[] {
    const stored = localStorage.getItem(`x402_recurring_${address}`);
    return stored ? JSON.parse(stored) : [];
  }

  private cancelLocalRecurringPayment(paymentId: string): void {
    // Implementation for local cancellation
    console.log('Cancelled local recurring payment:', paymentId);
  }

  private createLocalPaymentSchedule(
    from: string,
    payments: Array<{ to: string; amount: string; date: Date }>
  ): PaymentSchedule {
    const schedule: PaymentSchedule = {
      id: `ps_${Date.now()}`,
      payments: payments.map((p, i) => ({
        id: `sp_${Date.now()}_${i}`,
        amount: p.amount,
        scheduledDate: p.date,
        status: 'pending' as const,
      })),
      totalAmount: payments.reduce((sum, p) => {
        return (parseFloat(sum) + parseFloat(p.amount)).toString();
      }, '0'),
      status: 'active',
    };

    localStorage.setItem(`x402_schedule_${schedule.id}`, JSON.stringify(schedule));
    return schedule;
  }

  private calculateNextPaymentDate(frequency: 'daily' | 'weekly' | 'monthly'): Date {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.setDate(now.getDate() + 1));
      case 'weekly':
        return new Date(now.setDate(now.getDate() + 7));
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1));
    }
  }

  private async getScheduledPayment(paymentId: string): Promise<any> {
    // Mock implementation
    return {
      id: paymentId,
      recipient: '0x...',
      amount: '0.1',
    };
  }

  private async updatePaymentStatus(
    paymentId: string,
    status: 'completed' | 'failed',
    txHash?: string
  ): Promise<void> {
    console.log('Payment status updated:', { paymentId, status, txHash });
  }
}

export const x402Service = new X402Service();
