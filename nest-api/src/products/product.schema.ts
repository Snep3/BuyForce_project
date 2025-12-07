// src/products/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

//  Swagger import (added)
import { ApiProperty } from '@nestjs/swagger';  // Swagger added

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Comment {
  //  Swagger documentation for comment userId
  @ApiProperty({
    description: 'ID of the user who wrote the comment',
    type: String,
    example: '67401f025d8bb1aaf9343c12',
  }) // Swagger added
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  //  Swagger documentation for content
  @ApiProperty({
    description: 'Comment text written by the user',
    example: 'Amazing product!',
  }) // Swagger added
  @Prop()
  content: string;

  //  Swagger documentation for creation time
  @ApiProperty({
    description: 'Timestamp when the comment was created',
    example: '2025-02-12T15:23:45.000Z',
  }) // Swagger added
  @Prop({ default: Date.now })
  createdAt: Date;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Product {
  // Swagger: product name
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Mouse',
  }) // Swagger added
  @Prop({ required: true })
  name: string;

  //Swagger: product price
  @ApiProperty({
    description: 'Product price in USD',
    example: 49.99,
  }) // Swagger added
  @Prop({ required: true })
  price: number;

  //  Swagger: product category
  @ApiProperty({
    description: 'Category of the product',
    example: 'Electronics',
  }) // Swagger added
  @Prop({ required: true })
  category: string;

  // Swagger: stock quantity
  @ApiProperty({
    description: 'Amount of items remaining in stock',
    example: 120,
  }) // Swagger added
  @Prop({ default: 0 })
  stock: number;

  // Swagger: optional description
  @ApiProperty({
    description: 'Optional product description',
    required: false,
    example: 'A comfortable wireless mouse with 2-year battery life.',
  }) // Swagger added
  @Prop()
  description?: string;

  //  Swagger: array of comments
  @ApiProperty({
    description: 'List of comments on this product',
    type: [Comment],
  }) // Swagger added
  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
