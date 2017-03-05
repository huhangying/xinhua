/**
 * Created by harry on 16/11/29.
 */
var Schema = global.mongoose.Schema;

var _ArticlePageLog = new Schema({

        doctor: {type: Schema.Types.ObjectId, ref: 'doctor', required: true },  // from
        user: {type: Schema.Types.ObjectId, ref: 'user', required: true },      // to
        articlePage: { type: Schema.Types.ObjectId, ref: 'article_page', required: true },
        received: { type: Boolean, default: false },
        tryCount: { type: Number, default: 1 }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('article_page_log', _ArticlePageLog);