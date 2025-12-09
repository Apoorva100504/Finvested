// services/emailService.js
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class EmailService {
  
  // Send order confirmation email
  static async sendOrderConfirmation(userEmail, orderDetails) {
    const msg = {
      to: userEmail,
      from: 'apoorva@finestcoder.com', // Update with your verified sender
      subject: `Order Confirmation - ${orderDetails.symbol}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🎉 Order Executed Successfully!</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            <h3>Order Details:</h3>
            <p><strong>Symbol:</strong> ${orderDetails.symbol}</p>
            <p><strong>Type:</strong> ${orderDetails.orderType}</p>
            <p><strong>Quantity:</strong> ${orderDetails.quantity}</p>
            <p><strong>Price:</strong> ₹${orderDetails.price}</p>
            <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
            <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
            <p><strong>Status:</strong> ${orderDetails.status}</p>
          </div>
          <p style="margin-top: 20px;">Happy Investing! 📈</p>
          <p><em>Finvested Team</em></p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Order confirmation email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('❌ SendGrid error:', error.response?.body || error.message);
      return false;
    }
  }

  // Send price alert email
  static async sendPriceAlert(userEmail, alertDetails) {
    const msg = {
      to: userEmail,
      from: 'apoorva@finestcoder.com',
      subject: `💰 Price Alert: ${alertDetails.symbol} reached ₹${alertDetails.targetPrice}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">💰 Price Alert Triggered!</h2>
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px;">
            <h3>Alert Details:</h3>
            <p><strong>Stock:</strong> ${alertDetails.symbol}</p>
            <p><strong>Current Price:</strong> ₹${alertDetails.currentPrice}</p>
            <p><strong>Target Price:</strong> ₹${alertDetails.targetPrice}</p>
            <p><strong>Condition:</strong> ${alertDetails.condition}</p>
            <p><strong>Alert Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="margin-top: 20px;"><a href="http://localhost:3000" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Stock</a></p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Price alert email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('❌ SendGrid error:', error.response?.body || error.message);
      return false;
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(userEmail, userName) {
    const msg = {
      to: userEmail,
      from: 'apoorva@finestcoder.com',
      subject: 'Welcome to Finvested! Start Your Investment Journey 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Welcome to Finvested, ${userName}! 🎉</h2>
          <p>Your account has been successfully created and you're ready to start investing.</p>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What you can do:</h3>
            <ul>
              <li>📈 Trade stocks in real-time</li>
              <li>💰 Manage your portfolio</li>
              <li>🔔 Set price alerts</li>
              <li>📊 Access advanced analytics</li>
            </ul>
          </div>
          
          <p>Get started by exploring stocks or funding your wallet!</p>
          <p><a href="http://localhost:3000" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Investing</a></p>
          
          <p style="margin-top: 30px; color: #6b7280;">Happy investing!<br>The Finvested Team</p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Welcome email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('❌ SendGrid error:', error.response?.body || error.message);
      return false;
    }
  }
  static async sendOTPEmail(userEmail, otpCode) {
  const msg = {
    to: userEmail,
    from: 'apoorva@finestcoder.com',
    subject: 'Verify Your Email - Finvested',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Verify Your Email</h2>
        <p>Use the following OTP to verify your email address:</p>
        
        <div style="background: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #059669; font-size: 32px; margin: 0;">${otpCode}</h1>
          <p style="color: #6b7280; margin: 10px 0 0;">Valid for 10 minutes</p>
        </div>
        
        <p>If you didn't request this, please ignore this email.</p>
        <p><em>Finvested Team</em></p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ OTP email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ OTP email error:', error);
    return false;
  }
}
static async sendPasswordResetEmail(userEmail, otpCode) {
  const msg = {
    to: userEmail,
    from: 'apoorva@finestcoder.com',
    subject: 'Reset Your Password - Finvested',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Reset Your Password</h2>
        <p>Use the following OTP to reset your password:</p>
        
        <div style="background: #fef2f2; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #dc2626; font-size: 32px; margin: 0;">${otpCode}</h1>
          <p style="color: #6b7280; margin: 10px 0 0;">Valid for 10 minutes</p>
        </div>
        
        <p style="color: #6b7280;">If you didn't request this, please ignore this email.</p>
        <p><em>Finvested Security Team</em></p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Password reset email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Password reset email error:', error);
    return false;
  }
}
}