import { object, string } from 'yup';

export const userCreateSchema = object({
  name: string().required().max(50),
  email: string().required().email().max(50),
});
