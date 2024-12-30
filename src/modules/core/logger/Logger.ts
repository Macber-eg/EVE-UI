type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  debug(message: string, ...args: any[]) {
    if (import.meta.env.DEV) {
      console.debug(message, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    console.info(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(message, ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(message, ...args);
  }

  log(level: LogLevel, message: string, ...args: any[]) {
    switch (level) {
      case 'debug':
        this.debug(message, ...args);
        break;
      case 'info':
        this.info(message, ...args);
        break;
      case 'warn':
        this.warn(message, ...args);
        break;
      case 'error':
        this.error(message, ...args);
        break;
    }
  }
}