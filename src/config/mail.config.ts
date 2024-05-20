import { MailerOptions } from '@nestjs-modules/mailer';

export const mailConfig: MailerOptions = {
  transport: {
    host: '0.0.0.0',
    port: 1025,
  },
  defaults: {
    from: 'admin@example.com',
  },
};
