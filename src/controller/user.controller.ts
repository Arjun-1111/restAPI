/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable import/no-import-module-exports */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Request, Response } from 'express';
import log from '../utils/logger';
import { createUser } from '../service/user.service';
import { createUserInput } from '../schema/user.schema';

// (alias) interface Request<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = qs.ParsedQs, Locals extends Record<string, any> = Record<string, any>>. This is the interface before we set our defined "userInputType"
// P = core.ParamsDictionary = empty so {}, ResBody = empty

export const createUserHandler = async (
  req: Request<{}, {}, createUserInput['body']>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);
    // if user is created
    if (user) {
      return res.status(200).json({
        status: 'success',
        message: user,
      });
    }
    // if user is not created
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  } catch (error: any) {
    log.info(error);
    // status 409 means conflit we return to denote that some user have the same validation check that we applied
    return res.status(409).json({
      status: 'fail',
      message: error.message,
    });
  }
};
