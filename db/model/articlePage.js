/**
 * Created by harry on 16/11/29.
 */
var Schema = global.mongoose.Schema;

var _ArticlePage = new Schema({

        doctor: {type: Schema.Types.ObjectId, ref: 'doctor', required: true },  // from
        // userList: [
        //         {type: String }
        // ],      // to
        name: { type: String, required: true, trim: true }, // page section name
        cat: { type: Schema.Types.ObjectId, ref: 'page_cat', required: true }, // remove?
        title: { type: String, required: true },
        title_image: { type: String },
        content: { type: String },
        apply: { type: Boolean, default: false } // false: 未发送; true: 已发送

    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('article_page', _ArticlePage);