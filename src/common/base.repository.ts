import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export abstract class BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findAll(filter: Partial<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const newEntity = new this.model(data);
    const savedEntity = await newEntity.save();
    return savedEntity.toObject() as T;
  }

  async update(filter: Partial<T>, data: Partial<T>): Promise<T | null> {
    const updatedEntity = await this.model
      .findOneAndUpdate(filter, data, {
        new: true,
      })
      .exec();
    if (!updatedEntity) {
      throw new NotFoundException('Entity not found');
    }
    return updatedEntity;
  }

  async delete(filter: Partial<T>): Promise<void> {
    const result = await this.model.deleteOne(filter).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Entity not found');
    }
  }
}
