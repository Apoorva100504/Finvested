// test_env_simple.js
import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Testing environment variables:');
console.log('ALPHA_VANTAGE_API_KEY:', process.env.ALPHA_VANTAGE_API_KEY || 'NOT FOUND');
console.log('PORT:', process.env.PORT || 'NOT FOUND');
