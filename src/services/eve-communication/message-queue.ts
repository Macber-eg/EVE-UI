import { EVEMessage } from '../../types/eve';

export class MessageQueue {
  private static instance: MessageQueue;
  private queue: Map<string, EVEMessage[]>;
  private handlers: Map<string, Set<(message: EVEMessage) => void>>;

  private constructor() {
    this.queue = new Map();
    this.handlers = new Map();
  }

  public static getInstance(): MessageQueue {
    if (!MessageQueue.instance) {
      MessageQueue.instance = new MessageQueue();
    }
    return MessageQueue.instance;
  }

  async enqueue(message: EVEMessage): Promise<void> {
    const eveQueue = this.queue.get(message.to_eve_id) || [];
    eveQueue.push(message);
    this.queue.set(message.to_eve_id, eveQueue);
    
    // Notify handlers
    const handlers = this.handlers.get(message.to_eve_id);
    if (handlers) {
      handlers.forEach(handler => handler(message));
    }
  }

  async dequeue(eveId: string): Promise<EVEMessage | undefined> {
    const eveQueue = this.queue.get(eveId) || [];
    const message = eveQueue.shift();
    this.queue.set(eveId, eveQueue);
    return message;
  }

  onMessage(eveId: string, handler: (message: EVEMessage) => void): () => void {
    if (!this.handlers.has(eveId)) {
      this.handlers.set(eveId, new Set());
    }
    this.handlers.get(eveId)!.add(handler);
    
    return () => {
      const handlers = this.handlers.get(eveId);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(eveId);
        }
      }
    };
  }

  getQueueSize(eveId: string): number {
    return this.queue.get(eveId)?.length || 0;
  }
}

export const messageQueue = MessageQueue.getInstance();