/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-import-module-exports */
import { omit } from 'lodash';
import { DocumentDefinition, FilterQuery } from 'mongoose';
import User, { userDocument } from '../models/user.model';

export const createUser = async (
  input: DocumentDefinition<
    Omit<userDocument>,
    'createdAt' | 'updatedAt' | 'comparePassword'
  >
) => {
  try {
    const user = await User.create(input);
    return omit(user.toJSON(), 'password');
  } catch (error: any) {
    throw new Error(error);
  }
};

export const validatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // check user if user email exist
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }
  // compare the password if same
  // every user instance have the comparePassword method as we defined it in model it compare the candidate password with the user instance password
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return false;
  }
  // omit is a lodash method it help in removing the password field from the user document which we do not want to share with user, but convert to json first
  return omit(user.toJSON(), 'password');
};

export const findUser = async (query: FilterQuery<userDocument>) => {
  return await User.findOne(query).lean();
};
