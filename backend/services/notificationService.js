// services/notificationService.js
import axios from 'axios';

class NotificationService {
  constructor() {
    this.sendGridApiKey = process.env.SENDGRID_API_KEY;
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    this.firebaseConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
  }

  // ✅ ENHANCED: Add Firebase Push Notifications
  async sendPushNotification(fcmToken, title, body, data = {}) {
    try {
      if (this.firebaseConfig.projectId) {
        const { initializeApp, applicationDefault, cert } = await import('firebase-admin/app');
        const { getMessaging } = await import('firebase-admin/messaging');
        
        // Initialize Firebase if not already done
        try {
          initializeApp({
            credential: cert(this.firebaseConfig)
          });
        } catch (error) {
          // App already initialized
        }

        const message = {
          token: fcmToken,
          notification: {
            title: title,
            body: body
          },
          data: data,
          webpush: {
            headers: {
              Urgency: 'high'
            }
          }
        };

        const response = await getMessaging().send(message);
        console.log('✅ Push notification sent:', response);
        return { success: true, messageId: response };
      } else {
        // Fallback: console log
        console.log(`[PUSH] Title: ${title}, Body: ${body}, Data:`, data);
        return { success: true, messageId: `push_mock_${Date.now()}` };
      }
    } catch (error) {
      console.error('Push notification error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendEmail(to, subject, htmlContent, textContent = null) {
    try {
      if (this.sendGridApiKey) {
        const response = await axios.post(
          'https://api.sendgrid.com/v3/mail/send',
          {
            personalizations: [{ to: [{ email: to }] }],
            from: { email: 'apoorva@finestcoder.com', name: 'Finvested' }, // ✅ Use verified email
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
      if (this.twilioAccountSid && this.twilioAuthToken && this.twilioAccountSid !== 'YOUR_TWILIO_SID') {
        const twilio = await import('twilio');
        const client = twilio(this.twilioAccountSid, this.twilioAuthToken);
        
        const response = await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: to
        });
        
        return { success: true, sid: response.sid };
      } else {
        console.log(`[SMS] To: ${to}, Message: ${message}`);
        return { success: true, sid: `mock_${Date.now()}` };
      }
    } catch (error) {
      console.error('SMS sending error:', error);
      return { success: false, error: error.message };
    }
  }

  // ✅ ENHANCED: Send order notification with multiple channels
  async sendOrderNotification(userData, orderType, symbol, quantity, price) {
    const message = `Your ${orderType} order for ${quantity} shares of ${symbol} at ₹${price} has been executed.`;
    
    const results = [];

    // Send Email
    if (userData.email) {
      const emailResult = await this.sendEmail(
        userData.email,
        `Order Executed - ${symbol}`,
        `<h2>Order Executed Successfully!</h2><p>${message}</p>`
      );
      results.push({ channel: 'email', ...emailResult });
    }

    // Send Push Notification
    if (userData.fcmToken) {
      const pushResult = await this.sendPushNotification(
        userData.fcmToken,
        `📈 Order Executed`,
        `${orderType} ${quantity} ${symbol} at ₹${price}`,
        { type: 'order', symbol, orderType }
      );
      results.push({ channel: 'push', ...pushResult });
    }

    // Send SMS (if credentials are real)
    if (userData.phone) {
      const smsResult = await this.sendSMS(userData.phone, `Finvested: ${message}`);
      results.push({ channel: 'sms', ...smsResult });
    }

    console.log(`[ORDER_NOTIFICATION] User: ${userData.userId}, Results:`, results);
    return { success: true, results };
  }

  async sendKYCStatusNotification(userId, status) {
    const message = `Your KYC verification is ${status}.`;
    console.log(`[KYC_NOTIFICATION] User: ${userId}, Status: ${status}`);
    
    return { success: true, type: 'kyc_status' };
  }

  // ✅ NEW: Price alert notification
  async sendPriceAlert(userData, symbol, currentPrice, targetPrice) {
    const message = `💰 ${symbol} reached ₹${currentPrice} (Target: ₹${targetPrice})`;
    
    const results = [];

    // Push notification for immediate alert
    if (userData.fcmToken) {
      const pushResult = await this.sendPushNotification(
        userData.fcmToken,
        `💰 ${symbol} Alert!`,
        `Current: ₹${currentPrice} | Target: ₹${targetPrice}`,
        { type: 'price_alert', symbol, currentPrice: currentPrice.toString() }
      );
      results.push({ channel: 'push', ...pushResult });
    }

    // Email for detailed alert
    if (userData.email) {
      const emailResult = await this.sendEmail(
        userData.email,
        `Price Alert: ${symbol}`,
        `<h2>Price Alert Triggered!</h2><p>${message}</p>`
      );
      results.push({ channel: 'email', ...emailResult });
    }

    return { success: true, results };
  }
}

const notificationService = new NotificationService();
export { notificationService };