// users/user.schema.ts
import { Product } from './product.model';
import { SchemaFactory } from '@nestjs/mongoose';

export const ProductSchema = SchemaFactory.createForClass(Product);