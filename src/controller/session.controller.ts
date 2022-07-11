/* eslint-disable import/order */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Request, Response } from 'express';
import {
  createSession,
  findSessions,
  updateSession,
} from '../service/session.service';
import config from 'config';
import { validatePassword } from '../service/user.service';
import { signJwt } from '../utils/jwt_utils';

// eslint-disable-next-line import/prefer-default-export
export const createUserSessionHandler = async (req: Request, res: Response) => {
  // validate the users's password  [validate password is from user.service.ts]
  const user = await validatePassword(req.body);

  //   if user return false
  if (!user) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid email or password',
    });
  }
  // create a session
  const session = await createSession(user._id, req.get('user-agent') || '');
  // create an access token

  // while signing we are passing the user so the user has all the field such as email _id etc while verifying we get the decoded data in the same form
  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get('accessTokenTtl'), //15 minutes
    }
  );
  // create a refresh token
  // if valid accesstoken but expired we will set the new access token on the basis of the refresh token
  const refreshToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get('refreshTokenTtl'), //1 year
    }
  );

  // return acces token and refresh token
  res.status(200).json({
    status: 'success',
    accessToken,
    refreshToken,
  });
};

export const getUserSessionHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });
  return res.status(200).json({
    message: 'success',
    length: sessions.length,
    sessions,
  });
};

export const deleteSessionHandler = async (req: Request, res: Response) => {
  // res.locals.user.session -< .session is present because while setting the jwt we set the sessionid so while decoding we can get the same session value
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.status(200).json({
    accessToken: null,
    refreshToken: null,
  });
};
