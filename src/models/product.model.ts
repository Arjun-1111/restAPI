/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
import { userDocument } from './user.model';

// for creating custom id
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

// typescript definition for sessionSchema

export interface productDocument extends mongoose.Document {
  user: userDocument['_id'];
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    // generate a random id from nanoid if not provided by user
    productid: {
      type: String,
      required: true,
      uniques: true,
      default: () => `product_${nanoid()}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<productDocument>('Product', productSchema);

export default Product;
