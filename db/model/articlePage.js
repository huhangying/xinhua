/**
 * Created by harry on 16/11/29.
 */
var Schema = global.mongoose.Schema;

var _ArticlePage = new Schema({

        name: { type: String, required: true, trim: true }, // page section name
        cat: { type: Schema.Types.ObjectId, ref: 'page_cat', required: true }, // remove?
        title: { type: String },
        title_image: { type: String },
        template: { type: String },
        apply: { type: Boolean, default: true },

        createdAt: { type : Date, default: Date.now },
        updatedBy: { type: Schema.Types.ObjectId, required: true }
    });

module.exports =  mongoose.model('article_page', _ArticlePage);