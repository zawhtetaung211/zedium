import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/utils/dbConnect';
import Article from '@/mongoose/models/Article';
import cloudinary from '@/lib/utils/cloudinary';

/**
 * add an article
 */
const addArticle = async (req: NextApiRequest, res: NextApiResponse) => {
  async function saveArticle(obj) {
    try {
      const article = await new Article(obj).save();

      if(!article){
        res.status(400).json({error:"Article is not exist"})
      }
      const reqBody =
          typeof req.body === 'string' ? JSON.parse(req.body) : req.body; 
      return article.addAuthor(reqBody.author_id).then((_article) => {
        return res.status(200).json(_article);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  try {
    await dbConnect();
    const reqBody =
          typeof req.body === 'string' ? JSON.parse(req.body) : req.body; 
    let { text, title, claps, description } = reqBody;
    //let obj = { text, title, claps, description, feature_img: _feature_img != null ? `/uploads/${_filename}` : '' }
    if (req?.files?.image) {
      cloudinary.uploader.upload(
        req.files.image.path,
        (result) => {
          let obj = {
            text,
            title,
            claps,
            description,
            feature_img: result.url != null ? result.url : '',
          };
          saveArticle(obj);
          /*(new Student({...{url: result.url},...req.body})).save((err, newStudent) => {
          const cloud_res = {
              url: result.url
          }
          const newS = newStudent.toObject()
          console.log({...{url: result.url},...req.body})
          if(err)
              res.send(err)
          else if (!newStudent)
              res.send(400)
          else
              res.send({...newS,...cloud_res})
          next()
      })*/
        },
        {
          resource_type: 'image',
          eager: [{ effect: 'sepia' }],
        }
      );
    } else {
      saveArticle({ text, title, claps, description, feature_img: '' });
    }

    /*let base64Data = null
  const _feature_img = req.body.feature_img
  _feature_img != null ? base64Data = _feature_img.replace(/^data:image\/png;base64,/, "") : null
  const _filename = `medium-clone-${Date.now()}.png`;
  let { text, title, claps, description } = req.body
  let obj = { text, title, claps, description, feature_img: _feature_img != null ? `/uploads/${_filename}` : '' }
  fs.writeFile(`/uploads/${_filename}`, base64Data, 'base64', function(err) {
      if(err)
          console.log(err)
      new Article(obj).save((err, article) => {
          if (err)
              res.send(err)
          else if (!article)
              res.send(400)
          else {
              return article.addAuthor(req.body.author_id).then((_article) => {
                  return res.send(_article)
              })
          }
          next()
      })
  })*/
    /*new Article(obj).save((err, article) => {
      if (err)
          res.send(err)
      else if (!article)
          res.send(400)
      else {
          return article.addAuthor(req.body.author_id).then((_article) => {
              return res.send(_article)
          })
      }
      next()
  })*/
    /*var storage = multer.diskStorage({
      destination: function (req, file, callback) {
          callback(null, './uploads')
      },
      filename: function () {
          callback(null, )
      }
  })
  var upload = multer({
      storage: storage
  }).single('userFile')
  upload(req, res, function(err) {
  })*/
  } catch (error) {
    res.status(500).json(error);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      await addArticle(req, res);
    } else {
      res.send(405);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
