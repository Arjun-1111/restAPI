/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response } from 'express';
import {
  CreateProductInput,
  DeleteProductInput,
  ReadProductInput,
  UpdateProductInput,
} from '../schema/product.schema';
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
} from '../service/product.service';

export const createProductHandler = async (
  req: Request<{}, {}, CreateProductInput['body']>,
  res: Response
) => {
  const userId = res.locals.user._id;

  // eslint-disable-next-line prefer-destructuring
  const body = req.body;
  try {
    const product = await createProduct({ ...body, user: userId });

    return res.status(201).json({
      status: 'success',
      message: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'Internal server Error',
    });
  }
};

export const updateProductHandler = async (
  req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
  res: Response
) => {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const update = req.body;

  const product = await findProduct({ productId });
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Not Found',
    });
  }
  //   if the user did not create the product
  if (String(product.user) !== userId) {
    return res.status(403).json({
      status: 'error',
      message: 'UnAuthorized',
    });
  }

  const updatedProduct = await findAndUpdateProduct({ productId }, update, {
    new: true,
  });
  return res.status(200).json({
    status: 'success',
    message: updatedProduct,
  });
};

export const getProductHandler = async (
  req: Request<ReadProductInput['params']>,
  res: Response
) => {
  const productId = req.params.productId;
  const product = await findProduct({ productId });

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: [],
    });
  }

  return res.status(200).json({
    status: 'success',
    message: product,
  });
};

export const deleteProductHandler = async (
  req: Request<DeleteProductInput['params']>,
  res: Response
) => {
  const userId = res.locals.user._id;
  const productId = req.params.productId;

  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }

  await deleteProduct({ productId });

  return res.status(200).json({
    status: 'success',
  });
};
