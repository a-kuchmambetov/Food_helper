import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Email service for sending various types of emails
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // For development - remove in production
      },
    });

    // Verify SMTP connection on startup
    this.verifyConnection();
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ SMTP connection verified successfully");
    } catch (error) {
      console.error("❌ SMTP connection failed:", error.message);
      console.warn(
        "Email functionality will not work. Please check your SMTP configuration."
      );
    }
  }

  /**
   * Send email verification email
   */
  async sendVerificationEmail(email, name, verificationToken) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || "Food Helper",
        address: process.env.FROM_EMAIL || "noreply@foodhelper.com",
      },
      to: email,
      subject: "Verify Your Email Address - Food Helper",
      html: this.getVerificationEmailTemplate(name, verificationUrl),
      text: this.getVerificationEmailText(name, verificationUrl),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Failed to send verification email to ${email}:`, error);
      throw new Error("Failed to send verification email");
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email, name, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || "Food Helper",
        address: process.env.FROM_EMAIL || "noreply@foodhelper.com",
      },
      to: email,
      subject: "Reset Your Password - Food Helper",
      html: this.getPasswordResetEmailTemplate(name, resetUrl),
      text: this.getPasswordResetEmailText(name, resetUrl),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Failed to send password reset email to ${email}:`, error);
      throw new Error("Failed to send password reset email");
    }
  }

  /**
   * Send welcome email after successful verification
   */
  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || "Food Helper",
        address: process.env.FROM_EMAIL || "noreply@foodhelper.com",
      },
      to: email,
      subject: "Welcome to Food Helper! 🍽️",
      html: this.getWelcomeEmailTemplate(name),
      text: this.getWelcomeEmailText(name),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Failed to send welcome email to ${email}:`, error);
      // Don't throw error for welcome emails - they're not critical
      return { success: false, error: error.message };
    }
  }

  /**
   * HTML template for email verification
   */
  getVerificationEmailTemplate(name, verificationUrl) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .button:hover { background: #218838; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeeba; border-radius: 5px; padding: 15px; margin: 20px 0; color: #856404; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🍽️ Food Helper</h1>
            <h2>Verify Your Email Address</h2>
        </div>
        <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for registering with Food Helper! To complete your account setup and start discovering amazing recipes, please verify your email address.</p>
            
            <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px; font-family: monospace;">
                ${verificationUrl}
            </p>
            
            <div class="warning">
                <strong>⚠️ Important:</strong> This verification link will expire in 24 hours. If you didn't create an account with Food Helper, please ignore this email.
            </div>
            
            <p>After verification, you'll be able to:</p>
            <ul>
                <li>Save your favorite recipes</li>
                <li>Create custom meal plans</li>
                <li>Get personalized recipe recommendations</li>
                <li>Track your cooking history</li>
            </ul>
        </div>
        <div class="footer">
            <p>Happy cooking! 👨‍🍳👩‍🍳</p>
            <p>The Food Helper Team</p>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Plain text version for email verification
   */
  getVerificationEmailText(name, verificationUrl) {
    return `
Food Helper - Verify Your Email Address

Hello ${name},

Thank you for registering with Food Helper! To complete your account setup and start discovering amazing recipes, please verify your email address.

Click here to verify: ${verificationUrl}

⚠️ Important: This verification link will expire in 24 hours. If you didn't create an account with Food Helper, please ignore this email.

After verification, you'll be able to:
- Save your favorite recipes
- Create custom meal plans  
- Get personalized recipe recommendations
- Track your cooking history

Happy cooking!
The Food Helper Team
    `;
  }

  /**
   * HTML template for password reset
   */
  getPasswordResetEmailTemplate(name, resetUrl) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .button:hover { background: #c82333; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 15px; margin: 20px 0; color: #721c24; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔐 Food Helper</h1>
            <h2>Reset Your Password</h2>
        </div>
        <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>We received a request to reset your password for your Food Helper account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px; font-family: monospace;">
                ${resetUrl}
            </p>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </div>
        </div>
        <div class="footer">
            <p>Stay secure! 🔒</p>
            <p>The Food Helper Team</p>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Plain text version for password reset
   */
  getPasswordResetEmailText(name, resetUrl) {
    return `
Food Helper - Reset Your Password

Hello ${name},

We received a request to reset your password for your Food Helper account. 

Click here to reset your password: ${resetUrl}

⚠️ Security Notice: This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.

Stay secure!
The Food Helper Team
    `;
  }

  /**
   * HTML template for welcome email
   */
  getWelcomeEmailTemplate(name) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Food Helper!</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #28a745; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🎉 Welcome to Food Helper!</h1>
            <p>Your culinary journey starts here</p>
        </div>
        <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Congratulations! Your email has been verified and your Food Helper account is now active. We're excited to have you join our community of food enthusiasts!</p>
            
            <p>Ready to start cooking? <a href="${process.env.CLIENT_URL}" style="color: #28a745; font-weight: bold;">Visit Food Helper</a></p>
        </div>
        <div class="footer">
            <p>Happy cooking! 🍽️</p>
            <p>The Food Helper Team</p>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Plain text version for welcome email
   */
  getWelcomeEmailText(name) {
    return `
Welcome to Food Helper! 🎉

Hello ${name},

Congratulations! Your email has been verified and your Food Helper account is now active. We're excited to have you join our community of food enthusiasts!

Ready to start cooking? Visit: ${process.env.CLIENT_URL}

Happy cooking! 🍽️
The Food Helper Team
    `;
  }
}

export default new EmailService();
