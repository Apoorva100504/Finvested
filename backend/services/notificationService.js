// services/notificationService.js
import axios from 'axios';

class NotificationService {
  constructor() {
    this.sendGridApiKey = process.env.SENDGRID_API_KEY;
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  }

  async sendEmail(to, subject, htmlContent, textContent = null) {
    try {
      if (this.sendGridApiKey) {
        // SendGrid integration
        const response = await axios.post(
          'https://api.sendgrid.com/v3/mail/send',
          {
            personalizations: [{ to: [{ email: to }] }],
            from: { email: 'noreply@finvested.com', name: 'Finvested' },
            subject: subject,
            content: [
              {
                type: 'text/plain',
                value: textContent || htmlContent.replace(/<[^>]*>/g, '')
              },
              {
                type: 'text/html',
                value: htmlContent
              }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${this.sendGridApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return { success: true, messageId: response.data.id };
      } else {
        // Fallback: console log
        console.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
        return { success: true, messageId: `mock_${Date.now()}` };
      }
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendSMS(to, message) {
    try {
      if (this.twilioAccountSid && this.twilioAuthToken) {
        // Twilio integration
        const twilio = await import('twilio');
        const client = twilio(this.twilioAccountSid, this.twilioAuthToken);
        
        const response = await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: to
        });
        
        return { success: true, sid: response.sid };
      } else {
        // Fallback: console log
        console.log(`[SMS] To: ${to}, Message: ${message}`);
        return { success: true, sid: `mock_${Date.now()}` };
      }
    } catch (error) {
      console.error('SMS sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendOrderNotification(userId, orderType, symbol, quantity, price) {
    const message = `Your ${orderType} order for ${quantity} shares of ${symbol} at ₹${price} has been executed.`;
    
    // Get user preferences and contact info from database
    // For now, send to console
    console.log(`[ORDER_NOTIFICATION] User: ${userId}, ${message}`);
    
    return { success: true, type: 'order_execution' };
  }

  async sendKYCStatusNotification(userId, status) {
    const message = `Your KYC verification is ${status}.`;
    console.log(`[KYC_NOTIFICATION] User: ${userId}, Status: ${status}`);
    
    return { success: true, type: 'kyc_status' };
  }
}

const notificationService = new NotificationService();
export { notificationService };