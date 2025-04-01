import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from '../schemas/url.shema';

@Injectable()
export class UrlRepository {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  /**
   * Creates a new URL document
   * @param urlData The URL data to create
   * @returns The created URL document
   */
  async create(urlData: Partial<Url>): Promise<UrlDocument> {
    const newUrl = new this.urlModel(urlData);
    return newUrl.save();
  }

  /**
   * Finds a URL by shortcode
   * @param shortcode The shortcode to look up
   * @returns The URL document or null if not found
   */
  async findByShortcode(shortcode: string): Promise<UrlDocument | null> {
    return this.urlModel.findOne({ shortcode }).exec();
  }

  /**
   * Finds all URLs created by a specific user
   * @param userId The ID of the user
   * @returns An array of URL documents
   */
  async findByUserId(userId: string): Promise<UrlDocument[]> {
    return this.urlModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  /**
   * Increments the click count for a URL
   * @param shortcode The shortcode of the URL to update
   * @returns The updated URL document
   */
  async incrementClickCount(shortcode: string): Promise<UrlDocument | null> {
    return this.urlModel
      .findOneAndUpdate(
        { shortcode },
        { $inc: { clickCount: 1 } },
        { new: true },
      )
      .exec();
  }

  /**
   * Updates a URL document
   * @param id The ID of the URL to update
   * @param urlData The data to update
   * @returns The updated URL document
   */
  async update(id: string, urlData: Partial<Url>): Promise<UrlDocument | null> {
    return this.urlModel.findByIdAndUpdate(id, urlData, { new: true }).exec();
  }

  /**
   * Deletes a URL document
   * @param id The ID of the URL to delete
   * @returns The deleted URL document
   */
  async delete(id: string): Promise<UrlDocument | null> {
    return this.urlModel.findByIdAndDelete(id).exec();
  }

  /**
   * Checks if a URL exists by its original URL
   * @param originalUrl The original URL to check
   * @param userId The user ID to check against
   * @returns The existing URL document or null if not found
   */
  async findByOriginalUrlAndUserId(
    originalUrl: string,
    userId: string,
  ): Promise<UrlDocument | null> {
    return this.urlModel.findOne({ originalUrl, userId }).exec();
  }

  /**
   * Deletes expired URLs
   * @returns The number of deleted URLs
   */
  async deleteExpiredUrls(): Promise<number> {
    const result = await this.urlModel
      .deleteMany({
        expiresAt: { $lt: new Date(), $ne: null },
      })
      .exec();

    return result.deletedCount;
  }
}
