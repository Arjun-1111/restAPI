/* eslint-disable arrow-body-style */
/* eslint-disable import/no-unresolved */
import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import Product, { productDocument } from '../models/product.model';

export const createProduct = async (
  input: DocumentDefinition<Omit<productDocument, 'createdAt' | 'updatedAt'>>
) => {
  return Product.create(input);
};

export const findProduct = async (query: FilterQuery<productDocument>) => {
  return Product.findOne(query).lean();
};

export async function findAndUpdateProduct(
  query: FilterQuery<productDocument>,
  update: UpdateQuery<productDocument>,
  options: QueryOptions
) {
  return Product.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(query: FilterQuery<productDocument>) {
  return Product.deleteOne(query);
}
