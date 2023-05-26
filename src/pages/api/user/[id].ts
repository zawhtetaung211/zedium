import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/utils/dbConnect';
import User from '@/mongoose/models/User';

/**
 * get a user
 */
const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect()
    const userId = req.query.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User is not exist' });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json(error);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await getUser(req, res);
    } else {
      res.send(405);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
