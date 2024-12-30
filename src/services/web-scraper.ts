import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { AppError } from '../utils/error-handling';

export class WebScraperService {
  private static instance: WebScraperService;
  private turndown: TurndownService;

  private constructor() {
    this.turndown = new TurndownService();
  }

  public static getInstance(): WebScraperService {
    if (!WebScraperService.instance) {
      WebScraperService.instance = new WebScraperService();
    }
    return WebScraperService.instance;
  }

  async scrapeWebsite(url: string): Promise<{
    title: string;
    description: string;
    content: string;
    metadata: Record<string, any>;
  }> {
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Get page content
      const html = await page.content();
      const $ = cheerio.load(html);

      // Extract metadata
      const metadata = {
        title: $('title').text(),
        description: $('meta[name="description"]').attr('content'),
        keywords: $('meta[name="keywords"]').attr('content'),
        ogTitle: $('meta[property="og:title"]').attr('content'),
        ogDescription: $('meta[property="og:description"]').attr('content'),
        ogImage: $('meta[property="og:image"]').attr('content')
      };

      // Extract main content
      $('script').remove();
      $('style').remove();
      $('nav').remove();
      $('footer').remove();
      $('header').remove();

      const mainContent = $('main').length 
        ? $('main') 
        : $('body');

      const htmlContent = mainContent.html() || '';
      const markdownContent = this.turndown.turndown(htmlContent);

      await browser.close();

      return {
        title: metadata.title || '',
        description: metadata.description || metadata.ogDescription || '',
        content: markdownContent,
        metadata
      };
    } catch (error) {
      console.error('Web scraping error:', error);
      throw new AppError(
        'Failed to analyze website. Please check the URL and try again.',
        'SCRAPING_ERROR',
        500
      );
    }
  }

  async extractCompanyInfo(scrapedData: {
    title: string;
    description: string;
    content: string;
    metadata: Record<string, any>;
  }) {
    // Use Atlas to analyze the scraped content and extract company information
    const prompt = `
      Analyze the following website content and extract company information:
      Title: ${scrapedData.title}
      Description: ${scrapedData.description}
      Content: ${scrapedData.content.substring(0, 2000)}...

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
      name: scrapedData.title.split('|')[0].trim(),
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

export const webScraperService = WebScraperService.getInstance();