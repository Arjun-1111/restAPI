import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

// checkout zod npm page for more information

// const validate is function which return a function [currying], in that function it checks if body has req.body etc..

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error: unknown) {
      return res.status(400).json({
        message: error,
      });
    }
  };

export default validate;
