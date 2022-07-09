/* eslint-disable import/prefer-default-export */
// there is no need for creating a schema for validation but I am using "zod" for validation that is why i created it.
import { object, string, TypeOf } from 'zod';

export const userSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    password: string({
      required_error: 'Password is required',
    }).min(8, 'Password too short --  should be 8 char minimum'),
    passwordConfirm: string({
      required_error: 'Password Confirm is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
    // refine method check for password confirmation if both the password match or not if not then send a error message
  }).refine((data) => data.password === data.passwordConfirm, {
    message: 'Password do not match',
    path: ['passwordConfirm'],
  }),
});

// if there are any mismatch or any values we do not want to pass we use "Omit", so here we omitted body.confirmPassword as it is not defined in "userDocument" [path -- src/models/user.model.ts] interface
// we pass the "userDocument" interface in user.service.ts so we change there also
export type createUserInput = Omit<
  TypeOf<typeof userSchema>,
  'body.passwordConfirm'
>;
