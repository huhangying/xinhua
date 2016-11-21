/**
 * Created by harry on 16/11/20.
 */
var Schema = global.mongoose.Schema;

var _Page = new Schema({

        name: { type: String, required: true, trim: true }, // page section name
        department: { type: Schema.Types.ObjectId, ref: 'department', required: true },
        cat: { type: Schema.Types.ObjectId, ref: 'page_cat', required: true },
        title: { type: String },
        title_image: { type: String },
        edit_html: { type: String }, // url ?
        render_html: { type: String }, //url
        data: { type: String },
        apply: { type: Boolean, default: true }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('page', _Page);