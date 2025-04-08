import { google } from 'googleapis';
import nodemailer from 'nodemailer';

export default class MailService {
  constructor() {
    this.gmailAccount = process.env.GMAIL_ACCOUNT;
    this.clientId = process.env.CLIENT_ID;
    this.clientSecret = process.env.CLIENT_SECRET;
    this.refreshToken = process.env.REFRESH_TOKEN;

    // 建立 Google OAuth2 Client
    this.oAuth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      'https://developers.google.com/oauthplayground',
    );
    this.oAuth2Client.setCredentials({
      refresh_token: this.refreshToken,
    });

    this.transporter = null;
  }

  async setupTransporter() {
    try {
      const accessToken = await this.oAuth2Client.getAccessToken();
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.gmailAccount,
          clientId: this.clientId,
          clientSecret: this.clientSecret,
          refreshToken: this.refreshToken,
          accessToken: accessToken.token,
        },
      });
      console.log('[MailService] Transporter is ready');
    } catch (error) {
      console.error('[MailService] Error setting up transporter:', error);
      throw error;
    }
  }

  async sendMail(mailOptions) {
    try {
      if (!this.transporter) {
        console.log('[MailService] Transporter not found, setting up...');
        await this.setupTransporter();
      }

      await this.transporter.sendMail(mailOptions);
      console.log('[MailService] 郵件已成功傳送');
    } catch (error) {
      console.error('[MailService] 郵件傳送失敗:', error);
      if (error.code === 'EAUTH' || error.response?.includes('auth')) {
        console.log(
          '[MailService] Auth error detected, re-initializing transporter...',
        );
        await this.setupTransporter();
        try {
          await this.transporter.sendMail(mailOptions);
          console.log('[MailService] 郵件已成功傳送 (重試)');
        } catch (retryError) {
          console.error(
            '[MailService] Error sending email after retry:',
            retryError,
          );
        }
      } else {
        throw error;
      }
    }
  }
}
