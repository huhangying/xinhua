/**
 * Created by harry on 16/11/29.
 */
var Schema = global.mongoose.Schema;

var _ArticlePageLog = new Schema({

        doctor: {type: Schema.Types.ObjectId, ref: 'doctor', required: true },  // from
        user: {type: Schema.Types.ObjectId, ref: 'user', required: true },      // to
        articlePageId: { type: Schema.Types.ObjectId, ref: 'article_page', required: true },
        createdAt: { type : Date, default: Date.now },
        createdBy: { type: Schema.Types.ObjectId, required: true },
        read: { type: Number}
    });

module.exports =  mongoose.model('article_page_log', _ArticlePageLog);