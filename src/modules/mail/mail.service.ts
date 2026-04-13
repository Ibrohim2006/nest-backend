import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@/config/config.service';

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

  private loadTemplate(
    templateName: string,
    variables: Record<string, string | number>,
  ): string {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.html`,
    );
    let html = fs.readFileSync(templatePath, 'utf-8');

    for (const [key, value] of Object.entries(variables)) {
      html = html.replaceAll(`{{${key}}}`, String(value));
    }

    return html;
  }

  async sendVerificationEmail(
    email: string,
    username: string,
    code: number,
  ): Promise<void> {
    const html = this.loadTemplate('verification', { username, code });

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
    const html = this.loadTemplate('forgot-password', { username, code });

    await this.transporter.sendMail({
      from: this.configService.mail.from,
      to: email,
      subject: 'Password Reset Code',
      html,
    });
  }
}
