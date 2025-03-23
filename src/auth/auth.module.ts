import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/user/repositories/implementation/user.repositoy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/user/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        secret: ConfigService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
