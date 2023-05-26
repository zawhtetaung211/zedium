import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/utils/dbConnect';
import User from '@/mongoose/models/User';

/**
 * user_to_follow_id, user_id
 */
const followUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect()
    const userIdToFollow = req.body.id;
    if (!userIdToFollow) {
      res.status(400).json({ error: 'Invalid Request' });
      return;
    }
    const userToFollow = await User.findById(userIdToFollow);

    if (!userToFollow) {
      res.status(404).json({ error: 'User is not exist' });
    }
    const response = await userToFollow.follow();
    if (response) {
      res.status(200).json({ message: 'followed' });
    }
    res.status(500).json({ error: 'follow user' });
  } catch (error) {
    res.status(500).json(error);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      await followUser(req, res);
    } else {
      res.send(405);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// TODO:: validation middleware
export default handler;
