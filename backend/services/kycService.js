// services/kycService.js
import axios from 'axios';

class KYCService {
  constructor() {
    this.panVerificationUrl = process.env.PAN_VERIFICATION_API_URL;
    this.aadhaarVerificationUrl = process.env.AADHAAR_VERIFICATION_API_URL;
    this.apiKey = process.env.KYC_API_KEY;
  }

  async verifyPAN(panNumber, fullName, dateOfBirth) {
    try {
      // Integration with PAN verification API (e.g., Karza, Signzy, etc.)
      const response = await axios.post(this.panVerificationUrl, {
        pan_number: panNumber,
        full_name: fullName,
        date_of_birth: dateOfBirth
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return {
        isValid: response.data.status === 'valid',
        name: response.data.name,
        status: response.data.status,
        details: response.data
      };

    } catch (error) {
      console.error('PAN verification API error:', error);
      
      // Fallback: Basic PAN format validation
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      const isValidFormat = panRegex.test(panNumber);
      
      return {
        isValid: isValidFormat,
        name: null,
        status: isValidFormat ? 'format_valid' : 'invalid_format',
        details: { error: 'API unavailable, format validation only' }
      };
    }
  }

  async verifyAadhaar(aadhaarNumber, name) {
    try {
      // Integration with Aadhaar verification API
      const response = await axios.post(this.aadhaarVerificationUrl, {
        aadhaar_number: aadhaarNumber,
        name: name
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return {
        isValid: response.data.status === 'valid',
        status: response.data.status,
        details: response.data
      };

    } catch (error) {
      console.error('Aadhaar verification API error:', error);
      
      // Fallback: Basic Aadhaar format validation
      const aadhaarRegex = /^\d{12}$/;
      const isValidFormat = aadhaarRegex.test(aadhaarNumber);
      
      return {
        isValid: isValidFormat,
        status: isValidFormat ? 'format_valid' : 'invalid_format',
        details: { error: 'API unavailable, format validation only' }
      };
    }
  }

  async performFullKYC(panNumber, aadhaarNumber, userData) {
    try {
      const [panResult, aadhaarResult] = await Promise.all([
        this.verifyPAN(panNumber, `${userData.firstName} ${userData.lastName}`, userData.dateOfBirth),
        this.verifyAadhaar(aadhaarNumber, `${userData.firstName} ${userData.lastName}`)
      ]);

      const isVerified = panResult.isValid && aadhaarResult.isValid;

      return {
        isVerified,
        panVerification: panResult,
        aadhaarVerification: aadhaarResult,
        kycStatus: isVerified ? 'verified' : 'failed',
        verifiedAt: isVerified ? new Date().toISOString() : null
      };

    } catch (error) {
      console.error('Full KYC verification error:', error);
      return {
        isVerified: false,
        kycStatus: 'pending',
        verifiedAt: null,
        error: 'KYC service unavailable'
      };
    }
  }
}

const kycService = new KYCService();
export { kycService };