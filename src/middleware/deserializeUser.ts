/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/prefer-default-export */
import config from 'config';
import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { reIssueAccessToken } from '../service/session.service';
import { verifyJwt } from '../utils/jwt_utils';

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get is a lodash method - Gets the property value at path of object. If the resolved value is undefined the defaultValue is used in its place
  //   check if the req has headers.authorization if not set empty " " and if it is there then replace the bearer text with empty " "
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );
  if (!accessToken) {
    return next();
  }

  const refreshToken = get(req, 'headers.x-refresh');

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    // we set the request.locals to a new property called users which will contain all the decoded jwt data
    res.locals.user = decoded;
    return next();
  }

  // if the accessToken is expired and the user have the refreshToken reissue them a new refreshToken
  if (expired && refreshToken) {
    // create a new Access Token

    const newAccessToken = await reIssueAccessToken({ refreshToken });

    // if accessToken is created set the headers to new access token
    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
    }

    // set the res.local.user to new jwt decoded that contain all the values such as session user_id etc..
    const result = verifyJwt(newAccessToken);
    res.locals.user = result.decoded;
    return next();
  }

  return next();
};
