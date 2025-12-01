// src/products/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop()
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 0 })
  stock: number;

  @Prop()
  description?: string;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
