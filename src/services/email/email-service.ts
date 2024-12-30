import { google } from 'googleapis';
import { Client } from '@microsoft/microsoft-graph-client';
import { PublicClientApplication } from '@azure/msal-browser';
import { AppError } from '../../utils/error-handling';

export class EmailService {
  private static instance: EmailService;
  private msalClient: PublicClientApplication;
  private googleAuth: any;

  private constructor() {
    // Initialize Microsoft Authentication
    this.msalClient = new PublicClientApplication({
      auth: {
        clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: window.location.origin
      }
    });

    // Initialize Google Authentication
    this.initializeGoogleAuth();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private async initializeGoogleAuth() {
    try {
      this.googleAuth = await google.auth.getClient({
        credentials: {
          client_email: import.meta.env.VITE_GOOGLE_CLIENT_EMAIL,
          private_key: import.meta.env.VITE_GOOGLE_PRIVATE_KEY,
        },
        scopes: ['https://www.googleapis.com/auth/gmail.modify']
      });
    } catch (error) {
      console.error('Failed to initialize Google auth:', error);
    }
  }

  async sendEmail(params: {
    provider: 'google' | 'microsoft';
    to: string;
    subject: string;
    body: string;
    attachments?: Array<{ filename: string; content: string; contentType: string; }>;
  }) {
    try {
      if (params.provider === 'google') {
        return await this.sendGoogleEmail(params);
      } else {
        return await this.sendMicrosoftEmail(params);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new AppError('Failed to send email', 'EMAIL_ERROR', 500);
    }
  }

  private async sendGoogleEmail({ to, subject, body, attachments }: {
    to: string;
    subject: string;
    body: string;
    attachments?: Array<{ filename: string; content: string; contentType: string; }>;
  }) {
    const gmail = google.gmail({ version: 'v1', auth: this.googleAuth });
    
    const message = {
      to,
      subject,
      text: body,
      attachments
    };

    const encodedMessage = Buffer.from(
      Object.entries(message)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')
    ).toString('base64');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    return res.data;
  }

  private async sendMicrosoftEmail({ to, subject, body, attachments }: {
    to: string;
    subject: string;
    body: string;
    attachments?: Array<{ filename: string; content: string; contentType: string; }>;
  }) {
    const graphClient = Client.init({
      authProvider: async (done) => {
        try {
          const account = this.msalClient.getAllAccounts()[0];
          const response = await this.msalClient.acquireTokenSilent({
            scopes: ['Mail.Send'],
            account
          });
          done(null, response.accessToken);
        } catch (error) {
          done(error as Error, null);
        }
      }
    });

    const message = {
      message: {
        subject,
        body: {
          contentType: 'Text',
          content: body
        },
        toRecipients: [
          {
            emailAddress: {
              address: to
            }
          }
        ]
      }
    };

    if (attachments?.length) {
      message.message.attachments = attachments.map(attachment => ({
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: attachment.filename,
        contentType: attachment.contentType,
        contentBytes: attachment.content
      }));
    }

    const res = await graphClient
      .api('/me/sendMail')
      .post(message);

    return res;
  }

  async readEmails(params: {
    provider: 'google' | 'microsoft';
    folder?: string;
    maxResults?: number;
  }) {
    try {
      if (params.provider === 'google') {
        return await this.readGoogleEmails(params);
      } else {
        return await this.readMicrosoftEmails(params);
      }
    } catch (error) {
      console.error('Failed to read emails:', error);
      throw new AppError('Failed to read emails', 'EMAIL_ERROR', 500);
    }
  }

  private async readGoogleEmails({ folder = 'INBOX', maxResults = 10 }: {
    folder?: string;
    maxResults?: number;
  }) {
    const gmail = google.gmail({ version: 'v1', auth: this.googleAuth });
    
    const res = await gmail.users.messages.list({
      userId: 'me',
      labelIds: [folder],
      maxResults
    });

    const messages = await Promise.all(
      res.data.messages?.map(async (message) => {
        const details = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!
        });
        return details.data;
      }) || []
    );

    return messages;
  }

  private async readMicrosoftEmails({ folder = 'inbox', maxResults = 10 }: {
    folder?: string;
    maxResults?: number;
  }) {
    const graphClient = Client.init({
      authProvider: async (done) => {
        try {
          const account = this.msalClient.getAllAccounts()[0];
          const response = await this.msalClient.acquireTokenSilent({
            scopes: ['Mail.Read'],
            account
          });
          done(null, response.accessToken);
        } catch (error) {
          done(error as Error, null);
        }
      }
    });

    const res = await graphClient
      .api(`/me/mailFolders/${folder}/messages`)
      .top(maxResults)
      .get();

    return res.value;
  }
}

export const emailService = EmailService.getInstance();