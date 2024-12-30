import * as pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { AppError } from '../utils/error-handling';

export class DocumentProcessorService {
  private static instance: DocumentProcessorService;

  private constructor() {}

  public static getInstance(): DocumentProcessorService {
    if (!DocumentProcessorService.instance) {
      DocumentProcessorService.instance = new DocumentProcessorService();
    }
    return DocumentProcessorService.instance;
  }

  async processDocument(file: File): Promise<string> {
    try {
      const buffer = await file.arrayBuffer();
      let text = '';

      switch (file.type) {
        case 'application/pdf':
          const pdfData = await pdf(buffer);
          text = pdfData.text;
          break;

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          const result = await mammoth.extractRawText({ arrayBuffer: buffer });
          text = result.value;
          break;

        case 'text/plain':
          text = await file.text();
          break;

        default:
          throw new Error('Unsupported file type');
      }

      return text;
    } catch (error) {
      console.error('Document processing error:', error);
      throw new AppError(
        'Failed to process document. Please check the file format and try again.',
        'DOCUMENT_ERROR',
        500
      );
    }
  }

  async extractCompanyInfo(text: string) {
    // Use Atlas to analyze the document content and extract company information
    const prompt = `
      Analyze the following document content and extract company information:
      ${text.substring(0, 2000)}...

      Extract and format the following information:
      1. Company name
      2. Industry
      3. Company type (corporation, llc, nonprofit)
      4. Location/jurisdiction
      5. Key business areas
    `;

    // This would use Atlas/OpenAI to analyze the content
    // For now, return placeholder data
    return {
      name: 'Extracted Company Name',
      type: 'corporation',
      jurisdiction: 'Unknown',
      settings: {
        industry: 'Technology',
        autonomy_level: 'medium',
        human_oversight_required: [],
        notification_preferences: {
          email: true,
          push: true,
          urgency_threshold: 'medium'
        }
      }
    };
  }
}

export const documentProcessorService = DocumentProcessorService.getInstance();