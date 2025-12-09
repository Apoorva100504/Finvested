import { OAuth2Client } from 'google-auth-library';

export class GoogleAuthService {
  static client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  // Generate Google OAuth URL
  static generateAuthUrl() {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      prompt: 'consent'
    });
  }

  // Exchange code for tokens and get user info
  static async verifyCode(code) {
    try {
      // Exchange code for tokens
      const { tokens } = await this.client.getToken(code);
      this.client.setCredentials(tokens);

      // Get user info from Google
      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      
      return {
        success: true,
        user: {
          googleId: payload.sub,
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          picture: payload.picture,
          emailVerified: payload.email_verified
        },
        tokens
      };
    } catch (error) {
      console.error('Google OAuth error:', error);
      return {
        success: false,
        error: 'Failed to verify Google authentication'
      };
    }
  }
}