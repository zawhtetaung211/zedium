import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/utils/dbConnect';
import Article from '@/mongoose/models/Article';

const getArticle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();
    const articleId = req.query.id;
    if (!articleId) {
      res.status(400).json({ error: 'Invalid Request' });
    }
    const article = await Article.findById(articleId)
      .populate('author')
      .populate('comments.author')
      .exec();
    if (!article) {
      res.status(404).json({ error: 'Article is not found' });
    }
    res.status(200).json({ data: article });
  } catch (error) {
    res.status(500).json(500);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await getArticle(req, res);
    } else {
      res.send(405);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
