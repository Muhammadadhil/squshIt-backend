import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UrlRepository } from './repositories/url.repositoy';
import { Url } from './schemas/url.shema';
import * as mongoose from 'mongoose';

@Injectable()
export class UrlService {
  constructor(private readonly urlRepository: UrlRepository) {}

  /**
   * Creates a short URL for the given original URL
   * @param originalUrl The original URL to shorten
   * @param userId The ID of the user creating the short URL
   * @returns The created short URL object
   */
  async createShortUrl(originalUrl: string, userId: string): Promise<Url> {
    // Check if URL already exists for this user
    const existingUrl = await this.urlRepository.findByOriginalUrlAndUserId(
      originalUrl,
      userId,
    );

    if (existingUrl) {
      return existingUrl;
    }

    // Generate a random 8-character short code
    const shortcode = randomBytes(4).toString('hex');
    console.log('shortcode:', shortcode);

    // Create the new URL
    const newUrl = await this.urlRepository.create({
      originalUrl,
      shortcode,
      userId: new mongoose.Types.ObjectId(userId),
      clickCount: 0,
    });

    return newUrl;
  }

  /**
   * Creates a short URL with optional expiration
   * @param originalUrl The original URL to shorten
   * @param userId The ID of the user creating the short URL
   * @param expiresInDays Optional number of days until expiration
   * @returns The created short URL object
   */
  async createShortUrlWithExpiration(
    originalUrl: string,
    userId: string,
    expiresInDays?: number,
  ): Promise<Url> {
    // Check if URL already exists for this user
    const existingUrl = await this.urlRepository.findByOriginalUrlAndUserId(
      originalUrl,
      userId,
    );

    if (existingUrl) {
      return existingUrl;
    }

    // Generate a random 8-character short code
    const shortcode = randomBytes(4).toString('hex');

    // Calculate expiration date if provided
    let expiresAt: Date | undefined;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Create the new URL
    const newUrl = await this.urlRepository.create({
      originalUrl,
      shortcode,
      userId: new mongoose.Types.ObjectId(userId),
      createdAt: new Date(),
      expiresAt,
      clickCount: 0,
    });

    return newUrl;
  }

  /**
   * Retrieves all URLs created by a specific user
   * @param userId The ID of the user
   * @returns An array of URL objects
   */
  async getAllUrlsByUser(userId: string): Promise<Url[]> {
    return this.urlRepository.findByUserId(userId);
  }

  /**
   * Retrieves a URL by its shortcode
   * @param shortcode The shortcode to look up
   * @returns The URL object
   * @throws NotFoundException if the URL is not found
   */
  async getUrlByShortcode(shortcode: string): Promise<Url> {
    const url = await this.urlRepository.findByShortcode(shortcode);

    if (!url) {
      throw new NotFoundException(`URL with shortcode ${shortcode} not found`);
    }

    return url;
  }

  /**
   * Increments the click count for a URL
   * @param shortcode The shortcode of the URL
   */
  async incrementClickCount(shortcode: string): Promise<void> {
    await this.urlRepository.incrementClickCount(shortcode);
  }

  /**
   * Deletes expired URLs
   * @returns The number of deleted URLs
   */
  async cleanupExpiredUrls(): Promise<number> {
    return this.urlRepository.deleteExpiredUrls();
  }
}
