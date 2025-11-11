// razorpay-test.mjs
import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log('🔧 Testing Razorpay Connection...');
console.log('Key ID:', process.env.RAZORPAY_KEY_ID ? '✅ Present' : '❌ Missing');
console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? '✅ Present' : '❌ Missing');

// Test function
async function testRazorpay() {
  try {
    console.log('\n🚀 Testing Razorpay API...');
    
    // Test 1: Create a test order
    const order = await razorpay.orders.create({
      amount: 1000, // ₹10
      currency: 'INR',
      receipt: 'test_receipt_001',
      notes: {
        test: true
      }
    });
    
    console.log('✅ Order Creation SUCCESS!');
    console.log('Order ID:', order.id);
    console.log('Status:', order.status);
    console.log('Amount:', order.amount);
    
    // Test 2: Fetch the created order
    const fetchedOrder = await razorpay.orders.fetch(order.id);
    console.log('\n✅ Order Fetch SUCCESS!');
    console.log('Fetched Order Status:', fetchedOrder.status);
    
    // Test 3: List payments (empty since no payment made)
    const payments = await razorpay.payments.all();
    console.log('\n✅ Payments List SUCCESS!');
    console.log('Total Payments:', payments.count);
    
    console.log('\n🎉 ALL RAZORPAY TESTS PASSED!');
    
  } catch (error) {
    console.error('\n❌ Razorpay Test FAILED:');
    console.error('Error:', error.message);
    console.error('Status:', error.statusCode);
    
    if (error.error && error.error.description) {
      console.error('Description:', error.error.description);
    }
  }
}

// Run the test
testRazorpay();