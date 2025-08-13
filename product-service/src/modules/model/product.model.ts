
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product {
  @Prop({ required: true }) name: string;
  @Prop() description: string;
  @Prop({ required: true }) price: number;
  // @Prop({ required: true }) userId: string;
  @Prop() userId: string;
}