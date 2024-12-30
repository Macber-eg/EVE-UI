import { EVEMessage } from '../../types/eve';
import { messageQueue } from './message-queue';
import { messageHandler } from './message-handler';

export class StreamManager {
  private static instance: StreamManager;
  private activeStreams: Map<string, ReadableStream>;

  private constructor() {
    this.activeStreams = new Map();
  }

  public static getInstance(): StreamManager {
    if (!StreamManager.instance) {
      StreamManager.instance = new StreamManager();
    }
    return StreamManager.instance;
  }

  async createMessageStream(eveId: string): Promise<ReadableStream> {
    const stream = new ReadableStream({
      start: (controller) => {
        const cleanup = messageQueue.onMessage(eveId, async (message) => {
          try {
            const response = await messageHandler.processMessage(message);
            controller.enqueue(JSON.stringify({ type: 'message', data: response }));
          } catch (error) {
            controller.enqueue(JSON.stringify({ type: 'error', data: error.message }));
          }
        });

        // Store cleanup function
        this.activeStreams.set(eveId, stream);
        return () => {
          cleanup();
          this.activeStreams.delete(eveId);
        };
      }
    });

    return stream;
  }

  closeStream(eveId: string): void {
    const stream = this.activeStreams.get(eveId);
    if (stream) {
      stream.cancel();
      this.activeStreams.delete(eveId);
    }
  }

  isStreamActive(eveId: string): boolean {
    return this.activeStreams.has(eveId);
  }
}

export const streamManager = StreamManager.getInstance();