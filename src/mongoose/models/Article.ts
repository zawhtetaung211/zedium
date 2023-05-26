import { Schema, model, models } from 'mongoose';

const ArticleSchema = new Schema(
    {
        text: String,
        title: String,
        description: String,
        feature_img: String,
        claps: Number,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: [
            {
                author: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                text: String
            }
        ]
    }
);

ArticleSchema.methods.clap = function() {
    this.claps++
    return this.save()
}

ArticleSchema.methods.comment = function(c:object) {
    this.comments.push(c)
    return this.save()
}
ArticleSchema.methods.addAuthor = function (author_id:number) {
    this.author = author_id
    return this.save()
}
ArticleSchema.methods.getUserArticle = function (_id:number) {
    Article.find({'author': _id}).then((article) => {
        return article
    })
}

const Article = models.Article || model('Article', ArticleSchema);

export default Article;