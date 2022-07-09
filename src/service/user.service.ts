/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-import-module-exports */
import { DocumentDefinition } from 'mongoose';
import User, { userDocument } from '../models/user.model';

export const createUser = async (
  input: DocumentDefinition<
    Omit<userDocument>,
    'createdAt' | 'updatedAt' | 'comparePassword'
  >
) => {
  try {
    return await User.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
};
