import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../model/product.model';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  private async verifyUser(token: string) {
    if (!token) throw new UnauthorizedException('No token provided');    
    const result$ = this.authClient.send('auth.validate-token', { token });
    const user = await firstValueFrom(result$);
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }

  async create(dto: { name: string; description?: string; price: number }, token: string) {
    const user = await this.verifyUser(token);
    const product = await this.productModel.create({
      ...dto,
      userId: user.sub,
    });
    return product;
  }

  async findAll() {
    return this.productModel.find().exec();
  }

  async update(
    id: string,
    dto: Partial<{ name: string; description: string; price: number }>,
    token: string,
  ) {
    const user = await this.verifyUser(token);
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (product.userId !== user.sub) throw new ForbiddenException('Not the owner');
    Object.assign(product, dto);
    return product.save();
  }

  async delete(id: string, token: string) {
    const user = await this.verifyUser(token);
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (product.userId !== user.sub) throw new ForbiddenException('Not the owner');
    await product.deleteOne();
    return { success: true };
  }
}