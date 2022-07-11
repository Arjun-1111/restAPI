/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable arrow-body-style */

import jwt from 'jsonwebtoken';
import config from 'config';

const privateKey = config.get<string>('private_key');
const publicKey = config.get<string>('public_key');

export const signJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, privateKey, {
    // we check with short circuit if option is defined and if defined we spread the options
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = (token: string) => {
  // if jwt is not decoded it throws an error hence we use try catch
  try {
    // the decoded data contain all the values such as user document from mongoose session._id etc..
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: false,
    };
  }
};
