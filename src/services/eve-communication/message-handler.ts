import { EVEMessage } from '../../types/eve';
import { OpenAIService } from '../../lib/openai';
import { KnowledgeBase } from '../../lib/knowledge-base';

export class MessageHandler {
  private static instance: MessageHandler;
  private openai: OpenAIService;
  private knowledgeBase: KnowledgeBase;

  private constructor() {
    this.openai = OpenAIService.getInstance();
    this.knowledgeBase = KnowledgeBase.getInstance();
  }

  public static getInstance(): MessageHandler {
    if (!MessageHandler.instance) {
      MessageHandler.instance = new MessageHandler();
    }
    return MessageHandler.instance;
  }

  async processMessage(message: EVEMessage): Promise<string> {
    try {
      // Get relevant context from knowledge base
      const context = await this.knowledgeBase.search(message.content, {
        filters: {
          eve_id: message.to_eve_id
        },
        limit: 5
      });

      // Generate response using OpenAI
      const response = await this.openai.chat([
        {
          role: 'system',
          content: `You are an EVE™ (Enterprise Virtual Employee) processing a message. 
            Context from knowledge base:
            ${context.map(doc => doc.content).join('\n')}
            
            Message type: ${message.type}
            Priority: ${message.priority}
            Additional context: ${JSON.stringify(message.metadata)}`
        },
        {
          role: 'user',
          content: message.content
        }
      ]);

      // Store interaction in knowledge base
      await this.knowledgeBase.addDocument(
        JSON.stringify({
          message_id: message.id,
          content: message.content,
          response,
          type: message.type,
          timestamp: new Date().toISOString()
        }),
        {
          type: 'eve_communication',
          eve_id: message.to_eve_id,
          interaction_type: 'message'
        }
      );

      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
}

export const messageHandler = MessageHandler.getInstance();