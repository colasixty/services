import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { RabbitMQClientModule } from '../rabbitmq/rabbitmq-client.module';
import { UserEventsController } from './userevents.controller';
import { AuthMessageController } from './auth-message.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');        
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.register({
      secret: 'mySecret',
      signOptions: { expiresIn: '15m' },
    }),
    UsersModule,
    RabbitMQClientModule,
  ],
  controllers: [AuthController, UserEventsController, AuthMessageController],
  providers: [AuthService],
})
export class AuthModule {}
