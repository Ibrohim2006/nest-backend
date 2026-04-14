import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@/config/config.service';

import { verificationTemplate } from './templates/verification';
import { forgotPasswordTemplate } from './templates/forgot-password';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const { host, port, user, password } = this.configService.mail;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: password },
    });
  }

  async sendVerificationEmail(
    email: string,
    username: string,
    code: number,
  ): Promise<void> {
    const html = verificationTemplate(username, code);

    await this.transporter.sendMail({
      from: this.configService.mail.from,
      to: email,
      subject: 'Email Verification Code',
      html,
    });
  }

  async sendForgotPasswordEmail(
    email: string,
    username: string,
    code: number,
  ): Promise<void> {
    const html = forgotPasswordTemplate(username, code);

    await this.transporter.sendMail({
      from: this.configService.mail.from,
      to: email,
      subject: 'Password Reset Code',
      html,
    });
  }
}