/* eslint-disable import/extensions */
/* eslint-disable arrow-body-style */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/prefer-default-export */
import { get } from 'lodash';
import config from 'config';
import { FilterQuery, UpdateQuery } from 'mongoose';
import Session, { sessionDocument } from '../models/session.model';
import { signJwt, verifyJwt } from '../utils/jwt_utils';
import { findUser } from './user.service';

export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent });
  return session;
};

// the type of query is FilterQuery<T> it is ageneric so we provide our interface
// When documents are queried, they are returned as Mongoose Documents by default. With the Mongoose lean() method, the documents are returned as plain objects.
// The only challenge here is that you are not able to use Mongoose features such as save(), virtuals, getters, etc., if you use lean() on a query.

export const findSessions = async (query: FilterQuery<sessionDocument>) => {
  return Session.find(query).lean();
};

// find a session and update the session with the update query passed
export const updateSession = async (
  query: FilterQuery<sessionDocument>,
  update: UpdateQuery<sessionDocument>
) => {
  return Session.updateOne(query, update);
};

// reIssue access token
export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  // first we verify the refresh Token is correct
  const { decoded } = verifyJwt(refreshToken);

  // if the decoded is false or undefined or the decoded does not have session_id on it we return false

  if (!decoded || !get(decoded, 'session')) return false;

  // if everything is correct we find the session by the id
  const session = await Session.findById(get(decoded, 'session'));

  // if session is not false and session isValid is false we return false
  if (!session || !session.valid) {
    return false;
  }

  //find the user from session
  const user = await findUser({ _id: session.user });

  // if we do not have a user return false
  if (!user) return false;

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

  return accessToken;
};
