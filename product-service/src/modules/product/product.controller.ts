import { Controller, Post, Get, Patch, Delete, Body, Param, Headers } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(
    @Body() dto: { name: string; description?: string; price: number },
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    return this.productService.create(dto, token);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<{ name: string; description?: string; price?: number }>,
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    return this.productService.update(id, dto, token);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '');
    return this.productService.delete(id, token);
  }
}