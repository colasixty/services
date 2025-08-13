import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from '../model/products.module';
import { RabbitMQClientModule } from '../rabbitmq/rabbitmq-client.module';


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
    ProductsModule,
    RabbitMQClientModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}