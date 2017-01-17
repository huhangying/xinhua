/**
 * Created by harry on 17/1/17.
 */
var Schema = global.mongoose.Schema;

var _ArticleSearch = new Schema({

        name: { type: String, required: true, trim: true }, // page section name
        cat: { type: String }, // 类别
        title: { type: String, required: true },
        title_image: { type: String },
        targetUrl: { type: String, required: true },
        keywords: { type: String } // separated by |
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('article_search', _ArticleSearch);