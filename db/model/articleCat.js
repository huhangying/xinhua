/**
 * Created by harry on 16/11/29.
 */
var Schema = global.mongoose.Schema;

var _ArticleCat = new Schema({
    //hid: { type: String },
        department: { type: Schema.Types.ObjectId, ref: 'department', required: true },
        name: { type: String, required: true, trim: true }, // article Cat name
        desc: { type: String },
        apply: { type: Boolean, default: true }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('article_cat', _ArticleCat);