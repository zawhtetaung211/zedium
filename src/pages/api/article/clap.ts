import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/utils/dbConnect';
import Article from '@/mongoose/models/Article';

/**
 * clap on an article
 */
const clapArticle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();
    const reqBody =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    await Article.findById(reqBody.article_id)
      .then((article) => {
        return article.clap().then(() => {
          return res.status(200).json({ message: 'Done' });
        });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      await clapArticle(req, res);
    } else {
      res.send(405);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
