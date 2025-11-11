// test_razorpay.js
import { paymentService } from './services/paymentService.js';

async function testRazorpay() {
  console.log('🧪 Testing Razorpay Integration...\n');
  
  try {
    // Test creating a payment order
    const orderResult = await paymentService.createDepositOrder('test-user-123', 1000);
    
    if (orderResult.success && orderResult.orderId) {
      console.log('✅ Razorpay Integration: WORKING');
      console.log('   Order ID:', orderResult.orderId);
      console.log('   Amount:', orderResult.amount);
      console.log('   Currency:', orderResult.currency);
      console.log('\n📝 Next: Test payment flow in browser');
    } else {
      console.log('❌ Razorpay Integration Failed');
      console.log('   Error:', orderResult.error);
    }
    
  } catch (error) {
    console.log('❌ Razorpay Test Error:', error.message);
  }
}

testRazorpay();
