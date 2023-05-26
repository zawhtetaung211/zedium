import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/utils/dbConnect';
import Article from '@/mongoose/models/Article';

/**
 * comment on an article
 * comment, author_id, article_id
 */
const commentArticle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();
    const reqBody =
          typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const articleId = reqBody.article_id;

    if (!articleId) {
      res.status(400).json({ error: 'Invalid Request' });
    }
    await Article.findById(articleId)
      .then((article) => {
        return article
          .comment({
            author: articleId,
            text: reqBody.comment,
          })
          .then(() => {
            res.status(200).json({ message: 'Done' });
            return;
          });
      })
      .catch((error) => {
        res.status(500).json(error);
        return;
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      await commentArticle(req, res);
    } else {
      res.send(405);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
