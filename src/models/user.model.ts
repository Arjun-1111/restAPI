/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import config from 'config';
import bcrypt from 'bcrypt';

// typescript definition for userSchema

export interface userDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// using a pre mongoose hook ie. it basically run before the document is saved into database

userSchema.pre<userDocument>('save', async function (next) {
  const user = this as userDocument;

  // check to see if user modified the password ie. if he typed the password
  if (!user.isModified('password')) {
    return next();
  }

  // creating the salt and hashing the password , and then setting the hashed password to user.password that will be saved to database
  const salt = await bcrypt.genSalt(config.get<number>('salt_work_factor'));
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  return next();
});

// Instance method for comparing password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as userDocument;

  // compare the user password if correct return true else return false
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = mongoose.model<userDocument>('User', userSchema);

export default User;
