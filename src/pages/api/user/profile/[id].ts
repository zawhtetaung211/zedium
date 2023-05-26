import dbConnect from '@/lib/utils/dbConnect';
import Article from '@/mongoose/models/Article';
import User from '@/mongoose/models/User';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * get a user profile
 */
const getUserProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();
    const userId = req.query.id;
    if (!userId) {
      res.status(400).json({ error: 'Invalid Request' });
    }
    await User.findById(userId)
      .then(async (_user) => {
        return User.find({ following: userId }).then((_users) => {
          _users.forEach((user_) => {
            _user.addFollower(user_);
          });
          return Article.find({ author: userId }).then((_articles) => {
            return res.status(200).json({ user: _user, articles: _articles });
          });
        });
      })
  } catch (error) {
    res.status(500).json(error);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await getUserProfile(req, res);
    } else {
      res.send(405);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
