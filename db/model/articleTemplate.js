/**
 * Created by harry on 16/11/29.
 */
var Schema = global.mongoose.Schema;

var _ArticleTemplate = new Schema({

        name: { type: String, required: true, trim: true }, // page section name
        department: { type: Schema.Types.ObjectId, ref: 'department', required: true },
        cat: { type: Schema.Types.ObjectId, ref: 'page_cat', required: true },
        title: { type: String },
        title_image: { type: String },
        template: { type: String },
        apply: { type: Boolean, default: true },
        updatedBy: { type: Schema.Types.ObjectId, required: true }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('article_template', _ArticleTemplate);