import xss from 'xss';

export class SecurityService {
  private static instance: SecurityService;
  private csrfToken: string | null = null;

  private constructor() {
    this.setupCSRFToken();
  }

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  private setupCSRFToken(): void {
    // Generate a new CSRF token on initialization
    this.csrfToken = this.generateCSRFToken();
    
    // Add CSRF token to meta tag
    const metaTag = document.createElement('meta');
    metaTag.name = 'csrf-token';
    metaTag.content = this.csrfToken;
    document.head.appendChild(metaTag);
  }

  private generateCSRFToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  public getCSRFToken(): string {
    if (!this.csrfToken) {
      this.csrfToken = this.generateCSRFToken();
    }
    return this.csrfToken;
  }

  public sanitizeInput(input: string): string {
    return xss(input, {
      whiteList: {}, // No tags allowed
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script'] // Strip script tags and their content
    });
  }

  public validateCSRFToken(token: string): boolean {
    return token === this.csrfToken;
  }

  public sanitizeObject<T extends object>(obj: T): T {
    const sanitized = { ...obj };
    Object.keys(sanitized).forEach(key => {
      const value = sanitized[key as keyof T];
      if (typeof value === 'string') {
        sanitized[key as keyof T] = this.sanitizeInput(value) as T[keyof T];
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key as keyof T] = this.sanitizeObject(value) as T[keyof T];
      }
    });
    return sanitized;
  }
}

export const securityService = SecurityService.getInstance();