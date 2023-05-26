import type { NextApiRequest, NextApiResponse } from 'next';
import { validate } from '@/lib/middleware/validate';
import { userCreateSchema } from '@/lib/validation/user';
import dbConnect from '@/lib/utils/dbConnect';
import User from '@/mongoose/models/User';

/**
 * adds a user
 */
const addUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();
    const newUser = new User(req.body);
    const response = await newUser.save();
    if(response){
      res.status(200).json({ data: response });
    }
    res.status(400).json({ error: 'Create New User' });
  } catch (error) {
    res.status(500).json(error);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      await addUser(req, res);
    } else {
      res.send(405);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default validate(userCreateSchema, handler);
