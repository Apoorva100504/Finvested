// services/paymentService.js
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class PaymentService {
  constructor() {
    console.log('🔧 Initializing Razorpay with key:', process.env.RAZORPAY_KEY_ID ? '✅ Present' : '❌ Missing');
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are missing from environment variables');
    }
    
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    
    console.log('✅ Razorpay initialized successfully');
  }

  async createDepositOrder(userId, amount, currency = 'INR') {
    try {
      console.log('🔄 Creating Razorpay order for user:', userId, 'amount:', amount);
      
      // Create shorter receipt ID (under 40 characters)
      const timestamp = Date.now().toString().slice(-6);
      const receipt = `dep_${timestamp}`; // Simple receipt
      
      const orderOptions = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: currency,
        receipt: receipt,
        notes: {
          userId: userId,
          type: 'deposit'
        },
        payment_capture: 1
      };

      console.log('📦 Order options:', JSON.stringify(orderOptions, null, 2));

      const order = await this.razorpay.orders.create(orderOptions);

      console.log('✅ Razorpay order created:', order.id);

      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        razorpayKey: this.razorpay.key_id
      };

    } catch (error) {
      console.error('❌ Razorpay order creation error:');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.statusCode);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      if (error.error) {
        console.error('Razorpay error details:', error.error);
      }
      
      let errorMessage = 'Payment order creation failed';
      if (error.error && error.error.description) {
        errorMessage = error.error.description;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        errorDetails: error
      };
    }
  }

  verifyPaymentSignature(orderId, paymentId, signature) {
    try {
      console.log('🔐 Verifying payment signature...');
      
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      const isValid = expectedSignature === signature;
      console.log('📝 Signature verification:', isValid ? '✅ Valid' : '❌ Invalid');
      
      return isValid;
    } catch (error) {
      console.error('❌ Payment signature verification error:', error);
      return false;
    }
  }

  async processWithdrawal(userId, amount, bankAccount) {
    try {
      console.log(`💸 Processing withdrawal: User ${userId}, Amount: ${amount}, Bank: ${bankAccount.accountNumber}`);
      
      return {
        success: true,
        transactionId: `wd_${Date.now()}`,
        amount: amount,
        status: 'processed',
        processedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Withdrawal processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      console.log('📊 Fetching payment status for:', paymentId);
      const payment = await this.razorpay.payments.fetch(paymentId);
      console.log('✅ Payment status fetched:', payment.status);
      return payment;
    } catch (error) {
      console.error('❌ Error fetching payment status:', error);
      return null;
    }
  }
}

const paymentService = new PaymentService();
export { paymentService };
