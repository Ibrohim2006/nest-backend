import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('mail.host');
    const port = this.configService.get<number>('mail.port');
    const user = this.configService.get<string>('mail.user');
    const pass = this.configService.get<string>('mail.password');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  async sendVerificationEmail(
    email: string,
    username: string,
    code: number,
  ): Promise<void> {
    const from = this.configService.get<string>('mail.from');

    await this.transporter.sendMail({
      from: from,
      to: email,
      subject: 'Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome, ${username}! 🎉</h2>
          <p>Thank you for registering. Please use the code below to verify your email:</p>
          <div style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            background: #f0f4ff;
            padding: 20px;
            border-radius: 8px;
            margin: 24px 0;
            color: #3b5bdb;
          ">
            ${code}
          </div>
          <p>This code is valid for <strong>10 minutes</strong>.</p>
          <hr />
          <p style="color: #888; font-size: 12px;">
            If you did not register, please ignore this email.
          </p>
        </div>
      `,
    });
  }

  async sendForgotPasswordEmail(
    email: string,
    username: string,
    code: number,
  ): Promise<void> {
    const from = this.configService.get<string>('mail.from');

    await this.transporter.sendMail({
      from: from,
      to: email,
      subject: 'Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello, ${username}! 🔐</h2>
          <p>We received a request to reset your password. Use the code below to proceed:</p>
          <div style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            background: #fff4e6;
            padding: 20px;
            border-radius: 8px;
            margin: 24px 0;
            color: #e8590c;
          ">
            ${code}
          </div>
          <p>This code is valid for <strong>5 minutes</strong>.</p>
          <p>If you did not request a password reset, please secure your account immediately.</p>
          <hr />
          <p style="color: #888; font-size: 12px;">
            If you did not make this request, please ignore this email.
          </p>
        </div>
      `,
    });
  }
}
