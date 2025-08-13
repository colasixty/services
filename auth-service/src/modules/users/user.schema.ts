// users/user.schema.ts
import { User } from './user.model';
import { SchemaFactory } from '@nestjs/mongoose';

export const UserSchema = SchemaFactory.createForClass(User);