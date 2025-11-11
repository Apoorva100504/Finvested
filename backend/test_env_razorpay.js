// test_env_razorpay.js
import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Checking Razorpay Environment Variables:');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? '✅ Loaded' : '❌ Not loaded');
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '✅ Loaded' : '❌ Not loaded');

if (process.env.RAZORPAY_KEY_ID) {
  console.log('Key ID:', process.env.RAZORPAY_KEY_ID);
  console.log('Key Secret starts with:', process.env.RAZORPAY_KEY_SECRET?.substring(0, 6) + '...');
}
