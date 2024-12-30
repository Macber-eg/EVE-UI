export class TimerService {
  private static instance: TimerService;
  private timers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  public static getInstance(): TimerService {
    if (!TimerService.instance) {
      TimerService.instance = new TimerService();
    }
    return TimerService.instance;
  }

  public setTimer(id: string, callback: () => void, delay: number): void {
    this.clearTimer(id);
    const timer = setTimeout(() => {
      this.timers.delete(id);
      callback();
    }, delay);
    this.timers.set(id, timer);
  }

  public clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  public clearAll(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  public hasTimer(id: string): boolean {
    return this.timers.has(id);
  }

  public getActiveTimers(): string[] {
    return Array.from(this.timers.keys());
  }
}

export const timerService = TimerService.getInstance();