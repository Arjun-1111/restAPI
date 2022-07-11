import { Request, Response, NextFunction } from 'express';

// just a check to see if a res.local has user if it is not that means user is not set probably becuase it was not  verified by jwt we return 403
const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;

  if (!user) {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden',
    });
  }

  return next();
};

export default requireUser;
