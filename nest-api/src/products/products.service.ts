// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll() {
    return this.productModel
      .find()
      .populate('comments.userId', 'username')
      .exec();
  }

  async findById(id: string) {
    return this.productModel
      .findById(id)
      .populate('comments.userId', 'username')
      .exec();
  }

  async createProduct(data: {
    name: string;
    price: number;
    category: string;
    stock?: number;
    description?: string;
  }) {
    const { name, price, category, stock, description } = data;

    if (!name || price == null || !category) {
      throw new Error('Name, price, and category are required');
    }

    const product = new this.productModel({
      name,
      price,
      category,
      stock,
      description,
    });

    return product.save();
  }

  async addComment(productId: string, userId: string, content: string) {
    if (!content) {
      throw new Error('Comment content required');
    }

    const product = await this.productModel
      .findByIdAndUpdate(
        productId,
        {
          $push: {
            comments: { userId, content },
          },
        },
        { new: true },
      )
      .populate('comments.userId', 'username')
      .exec();

    return product;
  }
}
