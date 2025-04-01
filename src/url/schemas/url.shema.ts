import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type UrlDocument = Url & Document;

@Schema({ timestamps: true })
export class Url {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true, index: true })
  shortcode: string;

  @Prop({ default: 0 })
  clickCount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop({ default: null })
  expiresAt: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);

// Add indices for better query performance
UrlSchema.index({ shortcode: 1 }, { unique: true });
UrlSchema.index({ userId: 1 });
