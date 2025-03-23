import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/user/interfaces/IUser';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(email: string): Promise<IUser | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async create(user: IUser): Promise<IUser> {
    return await this.userModel.create(user);
  }
}
