import { db } from '../config/database.js';
import { randomUUID } from 'crypto';

export class OTPService {
  // Generate and send OTP
  static async generateOTP(email, purpose = 'email_verification') {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Store OTP in database
    await db.run(`
      INSERT INTO otp_verifications (id, email, otp_code, purpose, expires_at)
      VALUES ($1, $2, $3, $4, $5)
    `, [randomUUID(), email, otp, purpose, expiresAt]);
    
    return otp;
  }

  // Verify OTP
static async verifyOTP(email, otpCode, purpose) {
  try {
    console.log('🔍 Verifying OTP:', { email, otpCode, purpose });
    
    const otpRecord = await db.get(`
      SELECT * FROM otp_verifications 
      WHERE email = $1 AND otp_code = $2 AND purpose = $3
    `, [email, otpCode, purpose]);

    console.log('📋 OTP Record found:', otpRecord);

    if (!otpRecord) {
      console.log('❌ No OTP record found');
      return false;
    }

    if (otpRecord.is_used) {
      console.log('❌ OTP already used');
      return false;
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      console.log('❌ OTP expired');
      return false;
    }

    console.log('✅ OTP is valid');
    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
}
static async markOTPAsUsed(email, otpCode, purpose) {
  try {
    console.log('📝 Marking OTP as used:', { email, otpCode, purpose });
    
    const result = await db.run(`
      UPDATE otp_verifications 
      SET is_used = TRUE 
      WHERE email = $1 AND otp_code = $2 AND purpose = $3
    `, [email, otpCode, purpose]);
    
    console.log('✅ OTP marked as used');
    return true;
  } catch (error) {
    console.error('❌ Error marking OTP as used:', error);
    return false;
  }
}
}