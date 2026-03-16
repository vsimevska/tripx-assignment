import * as z from 'zod';

export const LoginFormSchema = z.object({
  username: z.string().trim().nonempty({ message: 'Username is required' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});

export type LoginFormErrors = {
  username?: string[];
  password?: string[];
};
