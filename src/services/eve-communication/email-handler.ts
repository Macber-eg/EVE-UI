import { emailService } from '../email/email-service';
import { EVEMessage } from '../../types/eve';
import { messageHandler } from './message-handler';

export class EmailHandler {
  private static instance: EmailHandler;

  private constructor() {}

  public static getInstance(): EmailHandler {
    if (!EmailHandler.instance) {
      EmailHandler.instance = new EmailHandler();
    }
    return EmailHandler.instance;
  }

  async processIncomingEmail(email: {
    from: string;
    subject: string;
    body: string;
    provider: 'google' | 'microsoft';
  }, eveId: string) {
    try {
      // Create EVE message from email
      const message: Omit<EVEMessage, 'id' | 'created_at'> = {
        from_eve_id: 'system',
        to_eve_id: eveId,
        content: `Email from: ${email.from}\nSubject: ${email.subject}\n\n${email.body}`,
        type: 'communication',
        priority: 'medium',
        status: 'sent',
        metadata: {
          source: 'email',
          provider: email.provider,
          original_sender: email.from,
          subject: email.subject
        }
      };

      // Process message using message handler
      const response = await messageHandler.processMessage(message);

      // Send email response
      await emailService.sendEmail({
        provider: email.provider,
        to: email.from,
        subject: `Re: ${email.subject}`,
        body: response
      });

    } catch (error) {
      console.error('Failed to process incoming email:', error);
      throw error;
    }
  }

  async sendEmailFromEVE(params: {
    eveId: string;
    to: string;
    subject: string;
    body: string;
    provider: 'google' | 'microsoft';
  }) {
    try {
      await emailService.sendEmail({
        provider: params.provider,
        to: params.to,
        subject: params.subject,
        body: params.body
      });
    } catch (error) {
      console.error('Failed to send email from EVE:', error);
      throw error;
    }
  }
}

export const emailHandler = EmailHandler.getInstance();